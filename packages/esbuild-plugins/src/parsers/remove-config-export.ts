import * as ts from "typescript";

export function removeConfigExport(sourceText: string): string {
  const sourceFile = ts.createSourceFile(
    "file.ts",
    sourceText,
    ts.ScriptTarget.ES2015,
    true,
  );

  const printer = ts.createPrinter();
  const resultFile = ts.transform(sourceFile, [removeConfigExportTransformer])
    .transformed[0];

  const result = printer.printNode(
    ts.EmitHint.Unspecified,
    resultFile,
    sourceFile,
  );

  return result;
}

function removeConfigExportTransformer(context: ts.TransformationContext) {
  return (node: ts.Node): ts.Node => {
    if (
      ts.isVariableStatement(node) &&
      node.declarationList.declarations.some(
        (decl) => decl.name.getText() === "config",
      )
    ) {
      return ts.factory.createNotEmittedStatement(node);
    }
    return ts.visitEachChild(
      node,
      (child) => removeConfigExportTransformer(context)(child),
      context,
    );
  };
}
