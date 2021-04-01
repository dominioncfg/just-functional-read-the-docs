---
layout: default
---

# Library Components

## Function

The function class is the entry point for Just Functional it can be constructed in serveral ways.

```C#
static void Main(string[] args)
{
    string fx = "(X*4)^2";
    //Using the default Configuration:
    var f1 = new Function(fx);

    //Using the Options Directly:
    var options = new FunctionOptions(
        evaluatorProvider: new CompiledExpressionEvaluatorFactory(),
        tokensProvider: new DefaultTokensProvider(),
        variablesProvider: null //null will use EvaluationContextVariablesProvider
    );
    var f2 = new Function(fx, options);

    // Using the Factory:
    var factory = FunctionFactoryBuilder.ConfigureFactory(options =>
    {
        options
            .WithEvaluationContextVariablesProvider()
            .WithDefaultsTokenProvider()
            .WithCompiledEvaluator();
    });
    var f3 = factory.Create(fx);

    //Use:
    var evaluationContext = new EvaluationContext(new Dictionary<string, decimal> { ["X"] = 3 });
    Console.WriteLine(f1.Evaluate(evaluationContext));//output: 144
    Console.WriteLine(f2.Evaluate(evaluationContext));//output: 144
    Console.WriteLine(f3.Evaluate(evaluationContext));//output: 144
}
```

In the code above f1, f2, f3 are using the same configuration.

You should know also that the Function class and everything in it is inmutable, that is, after the creation of the object is not posible to change anything (expression, evaluator, etc), the reason for this that inmutable objects have several advangages, like there is no side-effects, improve performance, maintanibilty, and keep things simple. If you need to construnct many function with the same configuration you should use the factory version.

### Evaluation Context

The EvaluatorContext class is the way you supply variables values at runtime and is really straight-forward to use.

```C#
//Using Constructor:
var context1 = new EvaluationContext(new Dictionary<string, decimal> { ["X"] = 3 });

//Registering variables manually:
var context2 = new EvaluationContext();
context2.RegisterVariable("X", 3);
```

The code above shows you how you can create a context with "X=3".

## Operands

Like in real math in Just functional an operand can be a number, a constant like Pi, or a variable.

### Variables

Variables are defined in the string when creating the function and they are assigned values when evaluating throught the EvaluationContext class. Variables are **case sensitive**.

#### Variable Provider

The role of variable providers is to "say" what are the variables that you Function will support. Out of the box the library will use the EvaluationContext to get the variables. But let say that you need to validate user input and you only allow functions with this variables: X,Y,Z then evaluating a function with another variable like 'J' will fail even if the values are supplied in the EvaluationContext, to acheive this you could use the PredefinedVariablesProvider.

At the moment there are two variables provider availables:

##### EvaluationContextVariablesProvider

This is the default provider and it will try to get all the available variables from the Evaluation Context whenever you evaluate your functon (Evaluate|EvaluateAsync).
Note that when using the compiled evaluator this proccess is only done the first time you are Evaluating the function.

To use this provider you can do the following:

```C#
//Using the Options Directly:
var options = new FunctionOptions(
    evaluatorProvider: new CompiledExpressionEvaluatorFactory(),
    tokensProvider: new DefaultTokensProvider(),
    variablesProvider: null //You need to pass null as the Value for Variables Provider
);
var f1 = new Function(fx, options);

// Using the Factory:
var factory = FunctionFactoryBuilder.ConfigureFactory(options =>
{
    options
        .WithEvaluationContextVariablesProvider();
        
});
var f2 = factory.Create(fx);
var context = new EvaluationContext(new Dictionary<string, decimal> { ["X"] = 3 });
Console.WriteLine(f1.Evaluate(context));//output: 144
Console.WriteLine(f2.Evaluate(context));//output: 144
```

##### PredefinedVariablesProvider

This will give you the possibilty to restrict variables in the expressions. It can be use like this:

```C#
//Using the Options Directly:
var variablesProvider = new PredefinedVariablesProvider(new[] { "X" });
var options = new FunctionOptions(
    evaluatorProvider: new CompiledExpressionEvaluatorFactory(),
    tokensProvider: new DefaultTokensProvider(),
    variablesProvider: variablesProvider
);
var f1 = new Function(fx, options);

// Using the Factory:
var factory = FunctionFactoryBuilder.ConfigureFactory(options =>
{
    options
        .WithPredefinedVariables("X");        
});
var f2 = factory.Create(fx);
var context = new EvaluationContext(new Dictionary<string, decimal> { ["X"] = 3 });
Console.WriteLine(f1.Evaluate(context));//output: 144
Console.WriteLine(f2.Evaluate(context));//output: 144

//'Y' is in the expression and is passed in the context, but this will fail:
var evaluationContext = new EvaluationContext(new Dictionary<string, decimal> { ["Y"] = 3 });
var f3 = new Function("Y+3", options);
var f4 = factory.Create("Y+3");
f3.Evaluate(evaluationContext);//Will fail
f4.Evaluate(evaluationContext);//Will fail
```

### Constants

You can use constants in your expressions, by default the library provides some you can add more. Tokens are **case sensitive**

#### Default Constants

By Default the library use the **DefaultTokensProvider** class that is responsible for Operators and Constants available to your function. And comes with the following Constants:

| Expression | Value          |
| ---------- | -------------- |
| pi         | System.Math.PI |
| e          | System.Math.E  |

#### Custom Constants

The following example shows how to create a function with another constant:

```C#
string fx = "X+c";
var constant = new Constant("c", 1);

//Using the Options Directly:
var defaultTokenProvider = new DefaultTokensProvider();
var allConstants = defaultTokenProvider.GetAvailableConstants().ToList();
allConstants.Add(constant);

var options = new FunctionOptions(
    evaluatorProvider: new CompiledExpressionEvaluatorFactory(),
    tokensProvider: new CustomizableTokensProvider(defaultTokenProvider.GetAvailableOperators(), allConstants),
    variablesProvider: null
);
var f1 = new Function(fx, options);

// Using the Factory:
var factory = FunctionFactoryBuilder.ConfigureFactory(options =>
    options.WithCustomTokenProvider(tokenOptions=>
        tokenOptions.WithConstant(constant)
    )
);
var f2 = factory.Create(fx);

var context = new EvaluationContext(new Dictionary<string, decimal> { ["X"] = 3 });
Console.WriteLine(f1.Evaluate(context));//output: 4
Console.WriteLine(f2.Evaluate(context));//output: 4
```

Note that Constants are part of ITokensProvider.GetAvailableConstants() method. Also Constants should be inmutable objects.

## Operators

Just like constants the library offers the posibility of customize the operators.

### Default Operators

By Default the library use the **DefaultTokensProvider** class that is responsible for Operators and Constants available to your function. And it includes the following Operators:

| Operator                   | Token | Example  | Precedence |
| -------------------------- | ----- | -------- | ---------- |
| Add                        | +     | 3+5      | 1          |
| Substract                  | -     | 5-3      | 1          |
| Multiply                   | *     | 3*2      | 2          |
| Divide                     | /     | 10/2     | 2          |
| SquareRoot                 | sqrt  | sqrt 144 | 3          |
| CubeRoot                   | cbr   | cbr 27   | 3          |
| Exponentiation             | ^     | 2^3      | 3          |
| Cosine                     | cos   | cos 0    | 4          |
| Sine                       | sen   | 1        | 4          |
| CommonLogarithm (log10)    | log   | log 100  | 4          |
| Factorial                  | fac   | fac 4    | 4          |
| Module                     | mod   | mod 5    | 4          |
| NaturalLogarithm   (log e) | ln    | ln 2.2   | 4          |

*The precedence fields determine the priority of the operator.
Ex: Multiply has a priority of 2, Add has a priority of 1 then multiply is executed first

### Custom Operators

The proccesses of creating an operator and a constants are similar but you need to make a new class that Inhherirs from the class **Operator** becuse they have some behaviour, now you should make you Operators derived class inmutable.

Before also lets have a look at the Operator class and its fields:

| Field         | Description                                  | Example |
| ------------- | -------------------------------------------- | ------- |
| Name          | Friendly Name of the operator                | Add     |
| RawToken      | The Token                                    | +       |
| Precedence    | The Priority of the opertator                | 1       |
| Type          | Numbers of operands requiered (Unary/Binary) | Binary  |
| Associativity | Associativity (Left/Right)                   | Left    |

- Create an operator class:

```C#
public class IncrementOperator : Operator
{
    public IncrementOperator() : base(name: "Increment",
                                      rawToken: "Inc",
                                      precedence: 10,
                                      type: OperatorType.Unary,
                                      associativity: Associativity.Left
                                     )
    {

    }
    public override decimal Calculate(List<Operand> operands, IEvaluationContext context)
    {
        //The operand can be a variable. the ResolveIfVariableOperand check if the operand 
        //is a variable and resolve the value for that variable otherwise 
        //returns the value of the operand itself
        return ResolveIfVariableOperand(operands[0], context) + 1;
    }
}
```

- Create the function with the operator:

```C#
string fx = "Inc X";

//Using the Options Directly:
var defaultTokenProvider = new DefaultTokensProvider();
var allOperators = defaultTokenProvider.GetAvailableOperators().ToList();
allOperators.Add(new IncrementOperator());

var options = new FunctionOptions(
    evaluatorProvider: new CompiledExpressionEvaluatorFactory(),
    tokensProvider: new CustomizableTokensProvider(allOperators, defaultTokenProvider.GetAvailableConstants()),
    variablesProvider: null
);
var f1 = new Function(fx, options);

// Using the Factory:
var factory = FunctionFactoryBuilder.ConfigureFactory(options =>
    options.WithCustomTokenProvider(tokenOptions =>
        tokenOptions.WithOperator(new IncrementOperator())
    )
);
var f2 = factory.Create(fx);

var context = new EvaluationContext(new Dictionary<string, decimal> { ["X"] = 3 });
Console.WriteLine(f1.Evaluate(context));//output: 4
Console.WriteLine(f2.Evaluate(context));//output: 4
```

## Priority betweeen Operator and Operands

## Exception Handling

## Low Level Components

### Evaluators

#### PostfixCompiledExpressionEvaluator

#### PostfixExpressionInMemoryEvaluator

### Tokenizers

Note: this site is still under construction as 2021/03/30.
