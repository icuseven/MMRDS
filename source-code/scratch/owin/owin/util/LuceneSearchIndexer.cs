using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using Lucene.Net.Analysis.Standard;
using Lucene.Net.Documents;
using Lucene.Net.Index;
using Lucene.Net.QueryParsers;
using Lucene.Net.Search;
using Lucene.Net.Store;
using Version = Lucene.Net.Util.Version;

//https://sites.google.com/site/williamhandev/n-layer-application/application-framework/lucene-search

namespace owin.util
{
	public static class LuceneSearchIndexer
	{
		static Lucene.Net.Store.Directory directory = FSDirectory.Open(new DirectoryInfo(@"C:\LuceneIndex"));
		static Lucene.Net.Analysis.Analyzer analyzer = new StandardAnalyzer(Lucene.Net.Util.Version.LUCENE_30);
		public static void RunIndex(IList<owin.model.home_record> entities)
		{
			using (var writer = new IndexWriter(directory, analyzer, true, IndexWriter.MaxFieldLength.LIMITED))
			{
				foreach (var home_record in entities)
				{
					var document = new Document();
					document.Add(new Field("id", home_record.id.ToString(), Field.Store.YES, Field.Index.NOT_ANALYZED));
					document.Add(new Field("record_id", home_record.record_id, Field.Store.YES, Field.Index.NOT_ANALYZED));
					document.Add(new Field("first_name", home_record.first_name, Field.Store.YES, Field.Index.NOT_ANALYZED));
					document.Add(new Field("middle_name", home_record.middle_name, Field.Store.YES, Field.Index.NOT_ANALYZED));
					document.Add(new Field("last_name", home_record.last_name, Field.Store.YES, Field.Index.NOT_ANALYZED));
					document.Add(new Field("date_of_death", home_record.date_of_death, Field.Store.YES, Field.Index.NOT_ANALYZED));
					document.Add(new Field("state_of_death", home_record.state_of_death, Field.Store.YES, Field.Index.NOT_ANALYZED));
					document.Add(new Field("agency_case_id", home_record.agency_case_id, Field.Store.YES, Field.Index.NOT_ANALYZED));
					document.Add(new Field("is_valid_maternal_mortality_record", home_record.is_valid_maternal_mortality_record.ToString(), Field.Store.YES, Field.Index.NOT_ANALYZED));
					document.Add(new Field("date_created", home_record.date_created.ToString("s") + "Z", Field.Store.YES, Field.Index.NOT_ANALYZED));
					document.Add(new Field("created_by", home_record.created_by, Field.Store.YES, Field.Index.NOT_ANALYZED));
					document.Add(new Field("date_last_updated", home_record.date_last_updated.ToString("s") + "Z", Field.Store.YES, Field.Index.NOT_ANALYZED));
					document.Add(new Field("last_updated_by", home_record.last_updated_by, Field.Store.YES, Field.Index.NOT_ANALYZED));
					document.Add(new Field("state_of_last_known_residence", home_record.state_of_last_known_residence, Field.Store.YES, Field.Index.NOT_ANALYZED));
					document.Add(new Field("death_certificate", home_record.death_certificate, Field.Store.YES, Field.Index.NOT_ANALYZED));
					document.Add(new Field("autopsy_report", home_record.autopsy_report, Field.Store.YES, Field.Index.NOT_ANALYZED));
					document.Add(new Field("birth_certificate_parent_section", home_record.birth_certificate_parent_section, Field.Store.YES, Field.Index.NOT_ANALYZED));
					document.Add(new Field("birth_certificate_infant_or_fetal_death_section", home_record.birth_certificate_infant_or_fetal_death_section, Field.Store.YES, Field.Index.NOT_ANALYZED));
					document.Add(new Field("prenatal_care_record", home_record.prenatal_care_record, Field.Store.YES, Field.Index.NOT_ANALYZED));
					document.Add(new Field("other_medical_visits",home_record.other_medical_visits, Field.Store.YES, Field.Index.NOT_ANALYZED));
					document.Add(new Field("er_visits_and_hospitalizations", home_record.er_visits_and_hospitalizations, Field.Store.YES, Field.Index.NOT_ANALYZED));
					document.Add(new Field("social_and_psychological_profile", home_record.social_and_psychological_profile, Field.Store.YES, Field.Index.NOT_ANALYZED));
					document.Add(new Field("informant_interviews", home_record.informant_interviews, Field.Store.YES, Field.Index.NOT_ANALYZED));
					document.Add(new Field("committe_review_worksheet", home_record.committe_review_worksheet, Field.Store.YES, Field.Index.NOT_ANALYZED));


					var allBuilder = new StringBuilder();
					allBuilder.Append(home_record.first_name);
					allBuilder.Append(" ");
					allBuilder.Append(home_record.last_name);
					allBuilder.Append(" ");

					document.Add(new Field("All", allBuilder.ToString(), Field.Store.YES, Field.Index.ANALYZED));

					writer.AddDocument(document);
				}
				writer.Optimize();
			}
		}
	}
}

