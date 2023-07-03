global using global::System;
global using global::System.Collections.Generic;
global using global::System.IO;
global using global::System.Linq;
global using global::System.Net.Http;
global using global::System.Threading;
global using global::System.Threading.Tasks;

namespace mmria.ije.generator;
public class Program
{

    static HashSet<string> tab_name = new()
    {
        "Mortality",
        "Natality",
        "Fetal Death"
    };
    public static async Task Main(string[] args)
    {
        const int seed = 1337;

        GenerationContext Context = new (seed);

        System.IO.File.WriteAllText("output/mort.MOR", new GenMortality(Context).ToString());
        System.IO.File.WriteAllText("output/nat.NAT", new GenNatality(Context).ToString());
        System.IO.File.WriteAllText("output/fet.FET", new GenFetality(Context).ToString());

        Console.WriteLine("IJE Generation Complete.");
    }



}

