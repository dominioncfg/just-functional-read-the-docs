---
layout: default
---

# Function

The function class is the entry point for Just Functional it can be constructed in several ways.

```C#
static void Main(string[] args)
{
    //Using the default Configuration:
    string fx = "(X*4)^2";

    var f1 = new Function(fx);
    var evaluationContext = new EvaluationContext(new Dictionary<string, decimal> { ["X"] = 3 });
    var result = f1.Evaluate(evaluationContext);

    Console.WriteLine(result);//output: 144
}
```

```C#
static async Task Main(string[] args)
{
    //Using the Options Directly:
    string fx = "(X*4)^2";

    var options = new FunctionOptions(
        evaluatorProvider: new CompiledExpressionEvaluatorFactory(),
        tokensProvider: new DefaultTokensProvider(),
        variablesProvider: null,
        cultureProvider: new CultureProvider()
    );

    var f1 = new Function(fx, options);
    var evaluationContext = new EvaluationContext(new Dictionary<string, decimal> { ["X"] = 3 });
    var result = f1.Evaluate(evaluationContext);

    Console.WriteLine(result);//output: 144
}
```

```C#
static async Task Main(string[] args)
{
    //Using the default Configuration:
    string fx = "(X*4)^2";

    // Using the Factory:
    var factory = FunctionFactoryBuilder.ConfigureFactory(options =>
    {
        options
            .WithEvaluationContextVariablesProvider()
            .WithDefaultsTokenProvider()
            .WithCompiledEvaluator()
            .WithSystemProvidedCulture();

    });

    var f1 = factory.Create(fx);
    var evaluationContext = new EvaluationContext(new Dictionary<string, decimal> { ["X"] = 3 });
    var result = f1.Evaluate(evaluationContext);

    Console.WriteLine(result);//output: 144
}
```

In the code above f1, f2, f3 are using the same configuration.

## Immutability

You should know that the Function class and everything in it is immutable, that is, after the creation of the object is not posible to change anything (expression, evaluator, operators, constants etc), the reason for this is that immutable objects have several advangages, like there is no side-effects, improve performance, maintanibilty, and keep things simple. If you need to construct many function with the same configuration you should use the factory version.

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
