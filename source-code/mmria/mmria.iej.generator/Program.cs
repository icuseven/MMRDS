global using global::System;
global using global::System.Collections.Generic;
global using global::System.IO;
global using global::System.Linq;
global using global::System.Net.Http;
global using global::System.Threading;
global using global::System.Threading.Tasks;

using Excel = Microsoft.Office.Interop.Excel;  

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

        Random rnd = new Random(seed);
        

        System.IO.File.WriteAllText("output/mort.MOR", new GenMortality(rnd).ToString());
        System.IO.File.WriteAllText("output/nat.NAT", new GenNatality(rnd).ToString());
        System.IO.File.WriteAllText("output/fet.FET", new GenFetality(rnd).ToString());

        Console.WriteLine("IJE Generation Complete.");
    }



}

