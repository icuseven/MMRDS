
namespace mmria.ije.generator;
public class GenerationContext
{
    public GenerationContext(int seed) 
    {
        rnd = new Random(seed);
    }

    const int seed = 1337;

    public Random rnd { get;}

}