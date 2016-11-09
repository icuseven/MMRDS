using System;
using System.Reflection;
using System.Reflection.Emit;

namespace owin.type_buider
{
	public static class Builder
	{
		//https://duckduckgo.com/?q=c%23+generate+dynamic+class&t=ironbrowser&ia=qa


		public static Type CreateObjectFromAppMetadata(owin.metadata.app app_metadata)
		{
			Type result = null;
			foreach(var node in app_metadata.children)
			{
				CreateObjectFromMetadata (node);

				switch(node.type.ToLower())
				{


				default:
					Console.WriteLine ("CreateObjectFromMetadata unimplemented (0}", node.type);
					break;
				}
			}

			return result;
		}



		public static Type CreateObjectFromMetadata(owin.metadata.node node)
		{
			Type result = null;

			switch(node.type.ToLower())
			{


				default:
					Console.WriteLine ("CreateObjectFromMetadata unimplemented (0}", node.type);
					break;
			}


			return result;
		}

		public static void CreateNewObject(System.Collections.Generic.List<System.Collections.Generic.KeyValuePair<string,Type>> field_type_pair_list)
		{
			var myType = CompileResultType(field_type_pair_list);
			var myObject = Activator.CreateInstance(myType);
		}

		public static Type CompileResultType(System.Collections.Generic.List<System.Collections.Generic.KeyValuePair<string,Type>> field_type_pair_list)
		{
			/*
			{"EmployeeID","int"},
			{"EmployeeName","String"},
			{"Designation","String"}
			*/



			TypeBuilder tb = GetTypeBuilder("string");
			//ConstructorBuilder constructor = tb.DefineDefaultConstructor(MethodAttributes.Public | MethodAttributes.SpecialName | MethodAttributes.RTSpecialName);

			// NOTE: assuming your list contains Field objects with fields FieldName(string) and FieldType(Type)
			foreach (var field in field_type_pair_list)
				CreateProperty(tb, field.Key,  field.Value);

			Type objectType = tb.CreateType();
			return objectType;
		}


		private static void CreateConstructor(TypeBuilder typeBuilder)
		{
			ConstructorBuilder constructor = typeBuilder.DefineConstructor(
				MethodAttributes.Public | 
				MethodAttributes.SpecialName | 
				MethodAttributes.RTSpecialName, 
				CallingConventions.Standard, 
				new Type[0]);
			//Define the reflection ConstructorInfor for System.Object
			ConstructorInfo conObj = typeof(object).GetConstructor(new Type[0]);

			//call constructor of base object
			ILGenerator il = constructor.GetILGenerator();
			il.Emit(OpCodes.Ldarg_0);
			il.Emit(OpCodes.Call, conObj);
			il.Emit(OpCodes.Ret);
		}

		private static TypeBuilder GetTypeBuilder(string typeSignature)
		{

			var an = new AssemblyName(typeSignature);
			AssemblyBuilder assemblyBuilder = AppDomain.CurrentDomain.DefineDynamicAssembly(an, AssemblyBuilderAccess.Run);
			ModuleBuilder moduleBuilder = assemblyBuilder.DefineDynamicModule("MainModule");
			TypeBuilder tb = moduleBuilder.DefineType(typeSignature,
				TypeAttributes.Public |
				TypeAttributes.Class |
				TypeAttributes.AutoClass |
				TypeAttributes.AnsiClass |
				TypeAttributes.BeforeFieldInit |
				TypeAttributes.AutoLayout,
				null);
			return tb;
		}

		private static void CreateProperty(TypeBuilder tb, string propertyName, Type propertyType)
		{
			FieldBuilder fieldBuilder = tb.DefineField("_" + propertyName, propertyType, FieldAttributes.Private);

			PropertyBuilder propertyBuilder = tb.DefineProperty(propertyName, PropertyAttributes.HasDefault, propertyType, null);
			MethodBuilder getPropMthdBldr = tb.DefineMethod("get_" + propertyName, MethodAttributes.Public | MethodAttributes.SpecialName | MethodAttributes.HideBySig, propertyType, Type.EmptyTypes);
			ILGenerator getIl = getPropMthdBldr.GetILGenerator();

			getIl.Emit(OpCodes.Ldarg_0);
			getIl.Emit(OpCodes.Ldfld, fieldBuilder);
			getIl.Emit(OpCodes.Ret);

			MethodBuilder setPropMthdBldr =
				tb.DefineMethod("set_" + propertyName,
					MethodAttributes.Public |
					MethodAttributes.SpecialName |
					MethodAttributes.HideBySig,
					null, new[] { propertyType });

			ILGenerator setIl = setPropMthdBldr.GetILGenerator();
			Label modifyProperty = setIl.DefineLabel();
			Label exitSet = setIl.DefineLabel();

			setIl.MarkLabel(modifyProperty);
			setIl.Emit(OpCodes.Ldarg_0);
			setIl.Emit(OpCodes.Ldarg_1);
			setIl.Emit(OpCodes.Stfld, fieldBuilder);

			setIl.Emit(OpCodes.Nop);
			setIl.MarkLabel(exitSet);
			setIl.Emit(OpCodes.Ret);

			propertyBuilder.SetGetMethod(getPropMthdBldr);
			propertyBuilder.SetSetMethod(setPropMthdBldr);
		}
	}
}
