import * as ts from "typescript";

export function readConfigExport(input: string) {
  const sourceFile = ts.createSourceFile(
    "file.ts",
    input,
    ts.ScriptTarget.ESNext,
    true,
  );

  const configExport = sourceFile.statements.find(
    (stmt) =>
      ts.isVariableStatement(stmt) &&
      stmt.declarationList.declarations.some(
        (decl) => decl.name.getText() === "config",
      ),
  ) as ts.VariableStatement | undefined;

  if (!configExport) {
    throw new Error("No named export 'config' found.");
  }

  const configDeclaration = configExport.declarationList.declarations.find(
    (decl) => decl.name.getText() === "config",
  ) as ts.VariableDeclaration;

  if (
    !configDeclaration ||
    !ts.isObjectLiteralExpression(configDeclaration.initializer!)
  ) {
    throw new Error("'config' is not an object literal.");
  }

  let configObjectStr = "{ ";

  configDeclaration.initializer.properties.forEach((prop, index, array) => {
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
        configObjectStr += `${key}: ${value}${
          index < array.length - 1 ? ", " : " "
        }`;
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

  configObjectStr += "}";

  return configObjectStr;
}
