import { demonstrateConditionalTypes } from './conditional-types';
import { demonstrateMappedTransformations } from './mapped-transformations';
import { demonstrateRecursiveParsing } from './recursive-parsing';
import { demonstrateStringManipulation } from './string-manipulation';
import { demonstrateTupleOperations } from './tuple-operations';

function main() {
  console.log("🚀 TypeScript Type-Level Programming Showcase\n");
  
  console.log("1. Conditional Types:");
  console.log("   - Type-level boolean logic");
  console.log("   - Function return type extraction");
  console.log("   - Deep readonly transformations");
  demonstrateConditionalTypes();
  console.log("");
  
  console.log("2. Mapped Type Transformations:");
  console.log("   - Property filtering by type");
  console.log("   - Key prefixing and manipulation");
  console.log("   - Getter/setter generation");
  demonstrateMappedTransformations();
  console.log("");
  
  console.log("3. Recursive Type Parsing:");
  console.log("   - JSON parsing at type-level");
  console.log("   - Array operations (reverse, join)");
  console.log("   - Deep flattening of nested structures");
  demonstrateRecursiveParsing();
  console.log("");
  
  console.log("4. String Manipulation:");
  console.log("   - Case conversions (camel, kebab, snake)");
  console.log("   - String splitting and replacement");
  console.log("   - URL building with type safety");
  demonstrateStringManipulation();
  console.log("");
  
  console.log("5. Tuple Operations:");
  console.log("   - Head, tail, and indexed access");
  console.log("   - Zip/unzip operations");
  console.log("   - Filtering and mapping at type-level");
  demonstrateTupleOperations();
  console.log("");
}

if (require.main === module) {
  main();
}