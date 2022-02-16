---
layout: default
---

# Exception Handling

All the exceptions in just functional derive from the **JustFunctionalBaseException** so you can use only one catch.
Below is a high level explanation of all other exceptions

| Exception                        | Throws when                                                               | Example                                              |
| -------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------- |
| JustFunctionalBaseException      | Base exception class                                                      |                                                      |
| MissingOperandException          | When there is a operator with less operands that required                 | 5+  or -*5                                           |
| MissingOperatorException         | When there are operands that need a operator that is missing              | 5X or 4+5)                                           |
| SyntaxErrorInExpressionException | General syntax error exception                                            | Xabc2. In here operator abc is not defined           |
| VariableUndefinedException       | When the expression needs a variable that is not passed in the Context    | Only applies when using PredefinedVariablesProvider  |
