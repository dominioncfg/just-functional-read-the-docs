---
layout: default
---

# Syntax Validation

Syntax validation can be done through **TryCreate** method from **IFunctionFactory**. This method will return an *TryCreateFunctionResult* object with the following behaviour.

| Field    | Type                      | Description                                                              |
| -------- | ------------------------- | ------------------------------------------------------------------------ |
| Success  | ```bool```                | Indicates if the expression was succesfuly parsed.                       |
| Errors   | ```IEnumerable<string>``` | If **Success** is false here is where you can find the reasons.          |
| Function | ```Function?```           | If **Success** is true here is when you can find the resulting Function. |

## Using the predefined variables provider

When you're using the predefined variable you can only pass the expression to TryCreate, like this:

```C#
var factory = FunctionFactoryBuilder.ConfigureFactory(options =>
{
    options
        .WithPredefinedVariables("X")        
        .WithDefaultsTokenProvider()
        .WithCompiledEvaluator();
});

string fx = "(X*4)^2";
TryCreateFunctionResult result = factory.TryCreate(fx);
```

## Using the evaluation context variable provider

When you're using the evalutaion context you will need to supply the variables as well:

```C#
var factory = FunctionFactoryBuilder.ConfigureFactory(options =>
{
    options
        .WithEvaluationContextVariablesProvider()        
        .WithDefaultsTokenProvider()
        .WithCompiledEvaluator();
});

string fx = "(X*4)^2";
var allowedVariables = new PredefinedVariablesProvider("X");
TryCreateFunctionResult result = factory.TryCreate(fx, allowedVariables);
```
