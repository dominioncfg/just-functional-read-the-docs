# Low Level Components

## Evaluators

Put it simply the evaluator is the algorithm used to parse and evaluate the functions/expressions.

### PostfixCompiledExpressionEvaluator

This is default evaluator and it consist an implementation of the [Shunting Yard](https://en.wikipedia.org/wiki/Shunting-yard_algorithm). On the first time you ask to evaluate the function it will compile the expression and then in another step it will evaluate the compiled expression.

### PostfixExpressionInMemoryEvaluator

This is also a version of the  [Shunting Yard](https://en.wikipedia.org/wiki/Shunting-yard_algorithm) but this time there is no compilation process, it will always compile and evaluate the expression.

### What Evaluator you should use

The PostfixExpressionInMemoryEvaluator is better when you only need to evaluate a function once and then you will.
The PostfixCompiledExpressionEvaluator (default) is situable for evaluating the same function several times because it compiles the expression only once.

Note that both evaluators are thread safe so you can use it in parallel but for heavy parallel loads you should use the PostfixExpressionInMemoryEvaluator, this one can have better performance becuase at the end both evalutators have the O(n) complexity and the PostfixCompiledExpressionEvaluator needs to compile the expression before is able to evaluate and this part is not pararellizable .

### Changing the evaluator

You can use the CompiledExpressionEvaluatorFactory/PostfixExpressionInMemoryEvaluator when using constructing the function directly or use the .WithCompiledEvaluator/.WithJustInTimeEvalutator when using the factory.

```C#
//Using the Options Directly:
string fx = "1 + X";
var evaluator = new CompiledExpressionEvaluatorFactory();
//or
//var evaluator = new PostfixExpressionInMemoryEvaluator();
var options = new FunctionOptions(
    evaluatorProvider: new CompiledExpressionEvaluatorFactory(),
    tokensProvider: new DefaultTokensProvider(),
    variablesProvider: null,
    cultureProvider: new CultureProvider()
);

var f1 = new Function(fx, options);
var context = new EvaluationContext(new Dictionary<string, decimal> { ["X"] = 3 });
var result = f1.Evaluate(context);

Console.WriteLine(result);//output: 4
```

```C#
// Using the Factory:
string fx = "1 + X";
var factory = FunctionFactoryBuilder.ConfigureFactory(options =>
    options
    .WithCompiledEvaluator()
//or
//.WithJustInTimeEvalutator()
);
var f1 = factory.Create(fx);

var context = new EvaluationContext(new Dictionary<string, decimal> { ["X"] = 3 });
var result = f1.Evaluate(context);

Console.WriteLine(result);//output: 4
```

## Tokenizers

The tokenizer is the object responsible of converting individuals characters in the expression to usable objects that one of the Evaluators make use of.

## What's next

You can learn the more about the [Limitations and Roadmap](pages/limitations-and-roadmap.html) or go to the [docs](../)
