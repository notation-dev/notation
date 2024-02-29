import ts from "typescript";

export function parseFnModule(input: string) {
  const sourceFile = ts.createSourceFile(
    "file.ts",
    input,
    ts.ScriptTarget.ESNext,
    true,
  );

  let exports: ReturnType<typeof getExportsFromStatement> = [];
  let imports: ReturnType<typeof getImportsFromStatement> = [];

  for (const statement of sourceFile.statements) {
    exports = exports.concat(getExportsFromStatement(statement));
  }

  for (const statement of sourceFile.statements) {
    imports = imports.concat(getImportsFromStatement(statement));
  }

  const configExport = exports.find((exp) => exp.name === "config");

  if (!configExport) {
    throw new Error("A config object was not exported");
  }

  const { config, configRaw } = createConfigObject(configExport.node);

  return {
    config,
    configRaw,
    exports: exports.map((exp) => exp.name),
    imports,
  };
}

function getImportsFromStatement(node: ts.Node) {
  const imports: Array<{ name: string; module: string }> = [];

  if (ts.isImportDeclaration(node)) {
    const module = node.moduleSpecifier.getText().slice(1, -1);
    if (node.importClause && ts.isImportClause(node.importClause)) {
      if (node.importClause.name) {
        imports.push({ name: node.importClause.name.getText(), module });
      }
      if (node.importClause.namedBindings) {
        if (ts.isNamespaceImport(node.importClause.namedBindings)) {
          imports.push({
            name: node.importClause.namedBindings.name.getText(),
            module,
          });
        } else if (ts.isNamedImports(node.importClause.namedBindings)) {
          for (const element of node.importClause.namedBindings.elements) {
            imports.push({ name: element.name.getText(), module });
          }
        }
      }
    }
  }
  return imports;
}

function getExportsFromStatement(
  node: ts.Node,
): Array<{ name: string; node: ts.Node }> {
  const exports: Array<{ name: string; node: ts.Node }> = [];

  if (ts.isVariableStatement(node)) {
    const hasExportModifier =
      node.modifiers &&
      node.modifiers.some((mod) => mod.kind === ts.SyntaxKind.ExportKeyword);
    if (hasExportModifier) {
      for (const declaration of node.declarationList.declarations) {
        if (!declaration.initializer) {
          throw new Error("Exports must be assigned a value");
        }
        exports.push({
          name: declaration.name.getText(),
          node: declaration.initializer,
        });
      }
    }
  } else if (
    ts.isFunctionDeclaration(node) &&
    node.name &&
    ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export
  ) {
    exports.push({
      name: node.name.getText(),
      node: node,
    });
  } else if (ts.isExportAssignment(node) && node.expression) {
    throw new Error("Default exports are not supported");
  } else if (
    ts.isExportDeclaration(node) &&
    node.exportClause &&
    ts.isNamedExports(node.exportClause)
  ) {
    throw new Error("Re-exporting is not supported");
  } else if (
    ts.isClassDeclaration(node) &&
    node.name &&
    ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export
  ) {
    throw new Error("Class exports are not supported");
  }
  return exports;
}

function createConfigObject(node: ts.Node) {
  if (!ts.isObjectLiteralExpression(node)) {
    throw new Error("'config' is not an object literal.");
  }
  let configRaw = "{ ";
  let config: Record<string, string | number | boolean> = {};
  node.properties.forEach((prop, index, array) => {
    if (ts.isPropertyAssignment(prop)) {
      const key = prop.name.getText();
      const valueNode = prop.initializer;
      if (
        ts.isStringLiteral(valueNode) ||
        ts.isNumericLiteral(valueNode) ||
        valueNode.kind === ts.SyntaxKind.TrueKeyword ||
        valueNode.kind === ts.SyntaxKind.FalseKeyword
      ) {
        const value = valueNode.getText();
        configRaw += `${key}: ${value}`;
        configRaw += index === array.length - 1 ? " }" : ", ";
        config[key] = JSON.parse(value);
      } else {
        throw new Error(
          `Invalid value type for key '${key}': only numbers, strings, and booleans are allowed.`,
        );
      }
    } else {
      throw new Error(
        `Invalid property assignment in 'config': ${prop.getText()}`,
      );
    }
  });

  return { config, configRaw };
}
