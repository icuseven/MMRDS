using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;


namespace migrate.set
{

    public class v2_4_Migration
    {

        public string host_db_url;
		public string db_name;
        public string config_timer_user_name;
        public string config_timer_value;

		public bool is_report_only_mode;

		public System.Text.StringBuilder output_builder;
        private Dictionary<string,mmria.common.metadata.value_node[]> lookup;

		public Dictionary<string, HashSet<string>> summary_value_dictionary = new Dictionary<string, HashSet<string>>(StringComparer.OrdinalIgnoreCase);
        public v2_4_Migration
        (
            string p_host_db_url, 
			string p_db_name, 
            string p_config_timer_user_name, 
            string p_config_timer_value,
			System.Text.StringBuilder p_output_builder,
			Dictionary<string, HashSet<string>> p_summary_value_dictionary,
			bool p_is_report_only_mode
        ) 
        {

            host_db_url = p_host_db_url;
			db_name = p_db_name;
            config_timer_user_name = p_config_timer_user_name;
            config_timer_value = p_config_timer_value;
			output_builder = p_output_builder;
			summary_value_dictionary = p_summary_value_dictionary;
			is_report_only_mode = p_is_report_only_mode;
        }


        public async Task execute()
        {
			this.output_builder.AppendLine($"v2.3 Data Migration started at: {DateTime.Now.ToString("o")}");
			DateTime begin_time = System.DateTime.Now;
			
			this.output_builder.AppendLine($"v2_4_Migration started at: {begin_time.ToString("o")}");
			
            var gs = new C_Get_Set_Value(this.output_builder);
			try
			{
				//string metadata_url = host_db_url + "/metadata/2016-06-12T13:49:24.759Z";
				//string metadata_url = $"https://testdb-mmria.services-dev.cdc.gov/metadata/version_specification-20.07.13/metadata";

				string metadata_url = $"{host_db_url}/metadata/version_specification-20.12.01/metadata";
				
				cURL metadata_curl = new cURL("GET", null, metadata_url, null, config_timer_user_name, config_timer_value);
				mmria.common.metadata.app metadata = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.metadata.app>(await metadata_curl.executeAsync());
            
            
            // pmss migration - start
            // 24
/*
            Migrate 10 -> 10.9
            Migrate Existing 20->20.9)
            Migrate Existing 30->30.1)
            Migrate Existing 31->31.1)
            Migrate Existing 60->60.1)
            Migrate Existing 40->40.1)
            Migrate Existing 50->50.1)
            Migrate Existing 70->70.1)
            Migrate Existing 80->80.9)
            Migrate Existing 82->82.9)
            Migrate Existing 83->83.9)
            Migrate Existing 85->85.1)
Migrate Existing 90->90.9)
Migrate Existing 89->89.9)
Migrate Existing 90->90.9)
Migrate Existing 91->91.9)
 Migrate Existing 92->92.9)
Migrate Existing 93->93.9)
Migrate Existing 95->95.1)
Migrate Existing 96->96.9)
Migrate Existing 97->97.9)
Migrate Existing 100->100.9)
Migrate Existing 999->999.1)
*/

            // pmss migration - end

// migration list
// 4.	Map existing Not Specified (#8888) -> Unknown (#7777)
/*

dcd_eiua_force 
dcd_ioh_origi
dcd_e_level
dciai_wia_work
dciai_wsbi_use
dcdi_doi_hospi
dcdi_doo_hospi
dcdi_mo_death
dcdi_wa_perfo
dcdi_waufd_codin
dcdi_p_statu
dcdi_dtct_death
bfdcpfodd_whd_plann
bfdcpfodd_a_type
bfdcpfodd_wm_trans
bfdcpdof_e_level
bfdcpdof_ifoh_origi
bfdcpdofr_ro_fathe
bfdcpdom_m_marri
bfdcpdom_Imnmhpabsit_hospi
bfdcpdom_eiua_force
bfdcpdom_ioh_origi
bfdcpdom_e_level
bfdcppc_plura
bfdcppc_ww_used
bfdcpcs_non_speci
bfdcprf_rfit_pregn
bfdcp_ipotd_pregn
bfdcp_oo_labor
bfdcp_o_proce
bfdcp_cola_deliv
bfdcp_m_morbi
bcifs_im_gesta
bcifsbad_gende
bcifsbad_iilato_repor
bcifsbad_iibba_disch
bcifsbad_witw2_hours
bcifsmod_wdwfab_unsuc
bcifsmod_wdwveab_unsuc
bcifsmod_f_deliv
bcifsmod_framo_deliv +1 4 -> 7777
bcifsmod_icwtol_attem
bcifs_aco_newbo

ar_coa_infor -1 + 4 -> 2
arrc_r_type
art_level
pppcf_p_type

pppcf_pp_type -1 +1 3 -> 4
pppcf_iu_wic
p_hpe_condi
p_wtdmh_condi
pfmh_i_livin
p_eos_use
psug_scree
psug_c_educa
pphdg_in_livin
pi_wp_plann
pi_wpub_contr
pit_wproi_treat
pit_fe_drugs
pit_ar_techn
pcp_whd_plann
pcp_apv_alone
p_wtp_ident
p_wta_react
pmaddp_ia_react
p_wtpd_hospi
p_wmrt_other
pmr_wa_kept
posopc_place
posopc_p_type -1 +1 3->4

evahmrbaadi_a_condi
evahmrbaadi_wrfa_hospi
evahmrbaadi_wtta_hospi
evahmrbaadi_dp_statu
evahmrbaadi_da_disch
evahmrnalf_mott_facil
evahmrnalf_oo_trave

evahmrlt_d_level +4
    1->2
    3->2
    4->5
    6->5

evahmrool_fd_route
evahmrool_m_gesta

evahmrba_title +3
    3->6
    5->6
    4->7

evahmr_wtco_anest
evahmr_aa_react
evahmr_as_proce
evahmr_ab_trans
omovv_v_type
omovmcf_p_type

omovmcf_provicer_type -1 +1 6->7
omovmcf_wtphppc_provi

omovlt_d_level +4
    1->2
    3->2
    4->5
    6->5



omovdiaot_t_type -1 +8
0 ->CT
1 ->CVS
2 -> ECG
3 -> EEG
4 ->MRI
5 -> PET
6 -> US
7 ->Xray
8 ->Other

saepsec_so_incom
saepsec_e_statu
saepsec_cl_arran
saepsec_homel
saepmoh_relat
saepmoh_gende
saepsamr_compi
saep_ds_use
mhp_wtdpmh_cond
mhpwtdmhc_rf_treat

            */
            
            }
            catch(Exception ex)
            {
                
            }
        }
    }
}