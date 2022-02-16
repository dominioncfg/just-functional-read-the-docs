---
layout: default
---

# Operators

Just like constants the library offers the possibility of customize the operators.

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
Ex: Multiply has a priority of 2, Add has a priority of 1 then multiply is executed first.

### Custom Operators

The proccesses of creating an operator and a constants are similar but you need to make a new class that Inhherirs from the class **Operator** becuse they have some behaviour, note that your Operator's derived class should be immutable.

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
//Using the Options Directly:
string fx = "Inc X";

var defaultTokenProvider = new DefaultTokensProvider();
var allOperators = defaultTokenProvider.GetAvailableOperators().ToList();
allOperators.Add(new IncrementOperator());

var options = new FunctionOptions(
    evaluatorProvider: new CompiledExpressionEvaluatorFactory(),
    tokensProvider: new CustomizableTokensProvider(allOperators, defaultTokenProvider.GetAvailableConstants()),
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
string fx = "Inc X";

var factory = FunctionFactoryBuilder.ConfigureFactory(options =>
   options.WithCustomTokenProvider(tokenOptions =>
       tokenOptions.WithOperator(new IncrementOperator())
   )
);

var f1 = factory.Create(fx);
var context = new EvaluationContext(new Dictionary<string, decimal> { ["X"] = 3 });
var result = f1.Evaluate(context);

Console.WriteLine(result);//output: 4
```
