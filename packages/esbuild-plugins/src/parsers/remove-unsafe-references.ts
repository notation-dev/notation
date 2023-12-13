import ts from "typescript";

export function removeUnsafeReferences(sourceText: string): string {
  const sourceFile = ts.createSourceFile(
    "file.ts",
    sourceText,
    ts.ScriptTarget.ES2015,
    true,
  );
  const printer = ts.createPrinter();

  let infraImports: Set<string> = new Set();

  function transformer(context: ts.TransformationContext) {
    return (node: ts.Node, isTopLevel: boolean = true): ts.Node => {
      if (
        ts.isImportDeclaration(node) &&
        ts.isStringLiteral(node.moduleSpecifier)
      ) {
        const path = node.moduleSpecifier.text;

        // todo: enable relative paths by resolving path to validate location
        if (path.startsWith("infra/")) {
          node.importClause?.namedBindings?.forEachChild((namedBinding) => {
            if (ts.isImportSpecifier(namedBinding)) {
              infraImports.add(namedBinding.name.text);
            }
          });
          return node;
        } else {
          return ts.factory.createNotEmittedStatement(node);
        }
      }

      if (
        ts.isStatement(node) &&
        containsUnsafeReferences(node, infraImports)
      ) {
        return ts.factory.createNotEmittedStatement(node);
      }

      return ts.visitEachChild(
        node,
        (child) => transformer(context)(child),
        context,
      );
    };
  }

  const transformedSourceFile = ts.transform(sourceFile, [transformer])
    .transformed[0];

  return printer.printFile(transformedSourceFile as ts.SourceFile);
}

function containsUnsafeReferences(
  node: ts.Node,
  safeReferences: Set<string>,
): boolean {
  let hasUnsafeReference = false;

  function visit(n: ts.Node, parent: ts.Node | undefined = undefined): void {
    if (ts.isIdentifier(n)) {
      if (isReference(n, parent) && !safeReferences.has(n.text)) {
        hasUnsafeReference = true;
      }
    } else {
      n.forEachChild((child) => visit(child, n));
    }
  }

  visit(node);

  return hasUnsafeReference;
}

function isReference(
  node: ts.Identifier,
  parent: ts.Node | undefined,
): boolean {
  if (!parent) {
    return false;
  }

  if (ts.isTypeReferenceNode(parent)) {
    return false;
  }

  if (ts.isTypeParameterDeclaration(parent) && parent.name === node) {
    return false;
  }

  if (
    (ts.isInterfaceDeclaration(parent) || ts.isTypeAliasDeclaration(parent)) &&
    parent.name === node
  ) {
    return false;
  }

  if (ts.isPropertyAssignment(parent) && parent.name === node) {
    return false;
  }

  if (ts.isPropertyAccessExpression(parent) && parent.name === node) {
    return false;
  }

  if (ts.isMethodDeclaration(parent) && parent.name === node) {
    return false;
  }

  if (ts.isParameter(parent) && parent.name === node) {
    return false;
  }

  if (ts.isVariableDeclaration(parent) && parent.name === node) {
    return false;
  }

  if (ts.isFunctionDeclaration(parent) && parent.name === node) {
    return false;
  }

  return true;
}
