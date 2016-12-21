using System;
using System.CodeDom.Compiler;
using System.IO;
using Microsoft.CSharp;


namespace mmria.server.codedom
{
	public class Code_dom
	{
		public CompilerResults compile(string source_code)
		{
			string source1 = File.ReadAllText(@source_code);
			//string source2 = File.ReadAllText(@"Source path here");
			var results = CompileCsharpSource(new[] { source_code }, new string[]{});

			if (results.Errors.Count == 0)
			{
				Console.WriteLine("No Errors");
			}
			else
			{
				foreach (CompilerError error in results.Errors)
					Console.WriteLine(error.ErrorText);
			}

			return results;
		}

		private CompilerResults CompileCsharpSource(string[] sources, params string[] references)
		{
			var parameters = new CompilerParameters(references);
			parameters.GenerateExecutable = false;
			using (var provider = new CSharpCodeProvider())
				return provider.CompileAssemblyFromSource(parameters, sources);
		}
	}
}
