
namespace mmria.ije.generator;
public class GenerationContext
{
    public GenerationContext(int seed) 
    {
        rnd = new Random(seed);
    }

    const int seed = 1337;

    public Random rnd { get;}

    public string Get(IList<string> list)
    {
        int index = rnd.Next(0, list.Count + 1);

        return list[index];
    }

    public static List<string> state_list = new()
    {
        "AL",
        "AK",
        "AZ",
        "AR",
        "CA",
        "CO",
        "CT",
        "DE",
        "DC",
        "FL",
        "GA",
        "HI",
        "ID",
        "IL",
        "IN",
        "IA",
        "KS",
        "KY",
        "LA",
        "ME",
        "MT",
        "NE",
        "NV",
        "NH",
        "NJ",
        "NM",
        "NY",
        "NC",
        "ND",
        "OH",
        "OK",
        "OR",
        "MD",
        "MA",
        "MI",
        "MN",
        "MS",
        "MO",
        "PA",
        "RI",
        "SC",
        "SD",
        "TN",
        "TX",
        "UT",
        "VT",
        "VA",
        "WA",
        "WV",
        "WI",
        "WY",

        "MP", //  NORTHERN MARIANAS
        "AS", //  AMERICAN SAMOA
        "GU", //  GUAM
        "VI", //   VIRGIN ISLANDS
        "PR", //  PUERTO RICO
        "Fo", //r Canadian Provinces:
        "AB", //  ALBERTA  
        "BC", //  BRITISH COLUMBIA 
        "MB", //  MANITOBA 
        "NB", //  NEW BRUNSWICK  
        "NF", // NEWFOUNDLAND  
        "NS", //  NOVA SCOTIA 
        "NT", //  NORTHWEST TERRITORIES
        "NU", //  NUNAVUT
        "ON", //  ONTARIO
        "PE", //  PRINCE EDWARD ISLAND 
        "QC", //  QUEBEC  
        "SK", //  SASKATCHEWAN
        "YT", //  
    };

}