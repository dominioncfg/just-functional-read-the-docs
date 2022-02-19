---
layout: default
---

# Function

The function class is the entry point for Just Functional it can be constructed in several ways.

```C#
//Using the default Configuration:
string fx = "(X*4)^2";

var f1 = new Function(fx);
var evaluationContext = new EvaluationContext(new Dictionary<string, decimal> { ["X"] = 3 });
var result = f1.Evaluate(evaluationContext);

Console.WriteLine(result);//output: 144
```

```C#
//Using the Options Directly:
string fx = "(X*4)^2";

var options = new FunctionOptions(
    evaluatorProvider: new CompiledExpressionEvaluatorFactory(),
    tokensProvider: new DefaultTokensProvider(),
    variablesProvider: null,
    cultureProvider: new CultureProvider()
);

var f2 = new Function(fx, options);
var evaluationContext = new EvaluationContext(new Dictionary<string, decimal> { ["X"] = 3 });
var result = f2.Evaluate(evaluationContext);

Console.WriteLine(result);//output: 144
```

```C#
// Using the Factory:
string fx = "(X*4)^2";

var factory = FunctionFactoryBuilder.ConfigureFactory(options =>
{
    options
        .WithEvaluationContextVariablesProvider()
        .WithDefaultsTokenProvider()
        .WithCompiledEvaluator()
        .WithSystemProvidedCulture();
});

var f3 = factory.Create(fx);
var evaluationContext = new EvaluationContext(new Dictionary<string, decimal> { ["X"] = 3 });
var result = f3.Evaluate(evaluationContext);

Console.WriteLine(result);//output: 144
```

In the code above f1, f2, f3 are using the same configuration.

## Evaluation Context

The EvaluatorContext class is the way you supply values to variables at runtime and is really straight-forward to use.

```C#
//Using Constructor:
var context1 = new EvaluationContext(new Dictionary<string, decimal> { ["X"] = 3 });

//Registering variables manually:
var context2 = new EvaluationContext();
context2.RegisterVariable("X", 3);
```

The code above shows you how you can create a context with "X=3".

Note that you can create an empty EvaluationContext when you need to evaluate a Function with no variables.

## What's next

You can learn the more about the [Operands](operands.html) or go to the [docs](../).
