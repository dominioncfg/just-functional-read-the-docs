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

## Example

```C#
try
{
    string fx = "Y+3";
    Function f = _functionFactory.Create(fx);
    var result = f.Evaluate(new EvaluationContext(new Dictionary<string, decimal>() {["X"] = 3}));
}
catch (JustFunctionalBaseException e)
{
    //Syntax error cause Y is not recognized....
}
```

## What's next

You can learn the more about the [Low Level Components](low-level-components.html) or go to the [docs](../)
