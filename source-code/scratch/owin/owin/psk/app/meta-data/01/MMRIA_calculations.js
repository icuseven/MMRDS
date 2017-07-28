// FUNCTION TO RECODE RACE TO OMB STANDARD
function $calculate_omb_recode(p_value_list) {
    // p_value_list is an array
    var result = null;
    var asian_list = [
            'Asian Indian',
            'Chinese',
            'Filipino',
            'Japanese',
            'Korean',
            'Vietnamese',
            'Other Asian'
        ];
    var islander_list = [
            'Native Hawaiian',
            'Guamanian or Chamorro',
            'Samoan',
            'Other Pacific Islander'
        ];
    if (p_value_list.length == 0) {
    } else if (p_value_list.length == 1) {
        if ($global.get_intersection(p_value_list, asian_list).length > 0) {
            result = 'Asian';
        } else if ($global.get_intersection(p_value_list, islander_list).length > 0) {
            result = 'Pacific Islander';
        } else {
            result = p_value_list[0];
        }
    } else
        // more than 1 item has been selected.
        {
            if (p_value_list.includes('Race Not Specified')) {
                result = 'Race Not Specified';
            } else {
                /* Description of recode process
			
			total unique = non list items + is_asian + is_islander
			
			non list items   is_asian   is_islander = total unique
			2 - 1 - 1 = 0      	   1          1              2
			2 - 1 - 0 = 1      	   1          0              2
			2 - 0 - 1 = 1      	   0          1              2
			2 - 0 - 0 = 2      	   0          0              2
			2 - 0 - 2 = 0      	   0          1              1
			2 - 2 - 0 = 0      	   1          0              1
			3 - 0 - 0 = 3      	   0          0              3
			3 - 1 - 1 = 1     	   1          1              3
			3 - 2 - 0 = 1      	   1          0              2
			*/
                var asian_intersection_count = $global.get_intersection(p_value_list, asian_list).length;
                var is_asian = 0;
                var islander_intersection_count = $global.get_intersection(p_value_list, islander_list).length;
                var is_islander = 0;
                if (asian_intersection_count > 0)
                    is_asian = 1;
                if (islander_intersection_count > 0)
                    is_islander = 1;
                var number_not_in_asian_or_islander_categories = p_value_list.length - asian_intersection_count - islander_intersection_count;
                var total_unique_items = number_not_in_asian_or_islander_categories + is_asian + is_islander;
                switch (total_unique_items) {
                case 1:
                    if (is_asian == 1) {
                        result = 'Asian';
                    } else if (is_islander == 1) {
                        result = 'Pacific Islander';
                    } else {
                        console.log('This should never happen bug');
                    }
                    break;
                case 2:
                    result = 'Bi-Racial';
                    break;
                default:
                    result = 'Multi-Racial';
                    break;
                }
            }
        }
    return result;
}
// CALCULATE INTERSECTION FOR OMB RACE RECODE
function $get_intersection(p_list_1, p_list_2) {
    var a = p_list_1.slice(0);
    var b = p_list_2.slice(0);
    a.sort();
    b.sort();
    var ai = 0, bi = 0;
    var result = [];
    while (ai < a.length && bi < b.length) {
        if (a[ai] < b[bi]) {
            ai++;
        } else if (a[ai] > b[bi]) {
            bi++;
        } else
            /* they're equal */
            /* they're equal */
            {
                result.push(a[ai]);
                ai++;
                bi++;
            }
    }
    return result;
}
//CALCLATE NUMBER OF DAYS BETWEEN 2 DATES
function $calc_days(p_start_date, p_end_date) {
    var days = null;
    p_start_date = p_start_date.getTime() / 86400000;
    p_end_date = p_end_date.getTime() / 86400000;
    days = Math.trunc(p_end_date - p_start_date);
    return days;
}
//CALCLATE NUMBER OF WEEKS BETWEEN 2 DATES
function $calc_weeks(p_start_date, p_end_date) {
    var weeks = null;
    p_start_date = p_start_date.getTime() / 604800000;
    p_end_date = p_end_date.getTime() / 604800000;
    weeks = Math.trunc(p_end_date - p_start_date);
    return weeks;
}
//CALCLATE NUMBER OF YEARS BETWEEN 2 DATES
function $calc_years(p_start_date, p_end_date) {
    var years = null;
    p_start_date = p_start_date.getTime() / 31557600000;
    p_end_date = p_end_date.getTime() / 31557600000;
    years = Math.trunc(p_end_date - p_start_date);
    return years;
}
//CALCLATE BMI FROM HEIGHT (IN INCHES)AND WEIGHT (IN POUNDS)
function $calc_bmi(p_height, p_weight) {
    var bmi = null;
    var height = parseInt(p_height);
    var weight = parseInt(p_weight);
    height /= 39.3700787;
    weight /= 2.20462;
    bmi = Math.round(weight / Math.pow(height, 2) * 10) / 10;
    return bmi;
}
// CALCULATE DISTANCE BETWEEN 2 COORDINATE PAIRS - HAVERSINE FORMULA (GREAT CIRCLE))
// UNIT DEFAULT = MILES
// LAT-LON ARE IN DECIMAL DEGREES
function $calc_distance(lat1, lon1, lat2, lon2) {
    var radlat1 = Math.PI * lat1 / 180;
    var radlat2 = Math.PI * lat2 / 180;
    var theta = lon1 - lon2;
    var radtheta = Math.PI * theta / 180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = Math.round(dist * 60 * 1.1515 * 100) / 100;
    return dist;
}
//VALIDATE A DATE WHEN USING YEAR-MONTH-DAY SEPARATE DATEPART INPUT
function $isValidDate(p_year, p_month, p_day) {
    var year = parseInt(p_year);
    var month = parseInt(p_month);
    var day = parseInt(p_day);
    if (isNaN(year) || isNaN(month) || isNaN(day))
        return false;
    var months31 = [
            1,
            3,
            5,
            7,
            8,
            10,
            12
        ];
    // months with 31 days
    var months30 = [
            4,
            6,
            9,
            11
        ];
    // months with 30 days
    var months28 = [2];
    // the only month with 28 days (29 if year isLeap)
    var isLeap = year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
    var valid = months31.indexOf(month) !== -1 && day <= 31 || months30.indexOf(month) !== -1 && day <= 30 || months28.indexOf(month) !== -1 && day <= 28 || months28.indexOf(month) !== -1 && day <= 29 && isLeap;
    return valid;
}
//CALCLATE GESTATIONAL AGE WITH LMP 
function $calc_ga_lmp(p_start_date, p_end_date) {
    result = [];
    var weeks = null;
    var days = null;
    weeks = Math.trunc($global.calc_days(p_start_date, p_end_date) / 7);
    days = $global.calc_days(p_start_date, p_end_date) % 7;
    result.push(weeks);
    result.push(days);
    return result;
}
//CALCLATE GESTATIONAL AGE WITH EDD 
function $calc_ga_edd(p_start_date, p_end_date) {
    result = [];
    var weeks = null;
    var days = null;
    if (p_start_date <= p_end_date) {
        if ($global.calc_days(p_start_date, p_end_date) % 7 == 0) {
            var weeks = 40 - Math.trunc($global.calc_days(p_start_date, p_end_date) / 7);
            var days = $global.calc_days(p_start_date, p_end_date) % 7;
        } else {
            var weeks = 39 - Math.trunc($global.calc_days(p_start_date, p_end_date) / 7);
            var days = 7 - $global.calc_days(p_start_date, p_end_date) % 7;
        }
    } else if (p_start_date > p_end_date) {
        var weeks = 40 - Math.trunc($global.calc_days(p_start_date, p_end_date) / 7);
        var days = Math.trunc($global.calc_days(p_start_date, p_end_date) % 7) * -1 + 1;
    }
    result.push(weeks);
    result.push(days);
    return result;
}
//INDEX FUNCTION FOR MULTI-PAGE FORMS
function $get_current_multiform_index() {
    var result = parseInt(window.location.href.substr(window.location.href.lastIndexOf('/') + 1, window.location.href.length - (window.location.href.lastIndexOf('/') + 1)));
    return result;
}
//----------------- Begin events ---------------------------------------------------
//CREATE UNIQUE RECORD ID
/*
path=home_record/record_id
event=onfocus
*/
function create_ID(p_control) {
    if ((!this.record_id || this.record_id == '') && this.state_of_death_record && this.state_of_death_record != '' && this.date_of_death.year && parseInt(this.date_of_death.year) > 999 && parseInt(this.date_of_death.year) < 2500) {
        this.record_id = this.state_of_death_record.substring(0, 2) + '-' + this.date_of_death.year + '-' + Math.random().toString().substring(2, 6);
        p_control.value = this.record_id;
    }
}
//CALCULATE MOTHERS AGE AT DEATH ON DC
/*
path=death_certificate/demographics/age
event=onfocus
*/
function mothers_age_death(p_control) {
    var years = null;
    var start_year = parseInt(this.date_of_birth.year);
    var start_month = parseInt(this.date_of_birth.month);
    var start_day = parseInt(this.date_of_birth.day);
    var end_year = parseInt(g_data.home_record.date_of_death.year);
    var end_month = parseInt(g_data.home_record.date_of_death.month);
    var end_day = parseInt(g_data.home_record.date_of_death.day);
    if ($global.isValidDate(start_year, start_month, start_day) == true && $global.isValidDate(end_year, end_month, end_day) == true) {
        var start_date = new Date(start_year, start_month - 1, start_day);
        var end_date = new Date(end_year, end_month - 1, end_day);
        var years = $global.calc_years(start_date, end_date);
        this.age = years;
        p_control.value = this.age;
    }
}
//CALCULATE MOTHERS AGE AT DELIVERY ON BC
/*
path=birth_fetal_death_certificate_parent/demographic_of_mother/age
event=onfocus
*/
function mothers_age_delivery(p_control) {
    var years = null;
    var start_year = parseInt(this.date_of_birth.year);
    var start_month = parseInt(this.date_of_birth.month);
    var start_day = parseInt(this.date_of_birth.day);
    var end_year = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.year);
    var end_month = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.month);
    var end_day = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.day);
    if ($global.isValidDate(start_year, start_month, start_day) == true && $global.isValidDate(end_year, end_month, end_day) == true) {
        var start_date = new Date(start_year, start_month - 1, start_day);
        var end_date = new Date(end_year, end_month - 1, end_day);
        var years = $global.calc_years(start_date, end_date);
        this.age = years;
        p_control.value = this.age;
    }
}
//CALCULATE FATHERS AGE AT DELIVERY ON BC
/*
path=birth_fetal_death_certificate_parent/demographic_of_father/age
event=onfocus
*/
function fathers_age_delivery(p_control) {
    var years = null;
    var start_year = parseInt(this.date_of_birth.year);
    var start_month = parseInt(this.date_of_birth.month);
    var start_day = parseInt(this.date_of_birth.day);
    var end_year = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.year);
    var end_month = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.month);
    var end_day = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.day);
    if ($global.isValidDate(start_year, start_month, start_day) == true && $global.isValidDate(end_year, end_month, end_day) == true) {
        var start_date = new Date(start_year, start_month - 1, start_day);
        var end_date = new Date(end_year, end_month - 1, end_day);
        var years = $global.calc_years(start_date, end_date);
        this.age = years;
        p_control.value = this.age;
    }
}
//CALCULATE PRE-PREGNANCY BMI ON BC
/*
path=birth_fetal_death_certificate_parent/maternal_biometrics/bmi
event=onfocus
*/
function prepregnancy_bmi(p_control) {
    var bmi = null;
    var height_feet = parseFloat(this.height_feet);
    var height_inches = parseFloat(this.height_inches);
    var weight = parseFloat(this.pre_pregnancy_weight);
    var height = height_feet * 12 + height_inches;
    if (height > 24 && height < 108 && weight > 50 && weight < 800) {
        var bmi = $global.calc_bmi(height, weight);
        this.bmi = bmi;
        p_control.value = this.bmi;
    }
}
//CALCULATE BMI FOR AUTOPSY
/*
path=autopsy_report/biometrics/mother/bmi
event=onfocus
*/
function autopsy_bmi(p_control) {
    var bmi = null;
    var height_feet = parseFloat(this.height.feet);
    var height_inches = parseFloat(this.height.inches);
    var weight = parseFloat(this.weight);
    var height = height_feet * 12 + height_inches;
    if (height > 24 && height < 108 && weight > 50 && weight < 800) {
        var bmi = $global.calc_bmi(height, weight);
        this.bmi = bmi;
        p_control.value = this.bmi;
    }
}
//CALCULATE BMI FOR PRENATAL CARE RECORD
/*
path=prenatal/current_pregnancy/bmi
event=onfocus
*/
function prenatal_bmi(p_control) {
    var bmi = null;
    var height_feet = parseFloat(this.height.feet);
    var height_inches = parseFloat(this.height.inches);
    var weight = parseFloat(this.pre_pregnancy_weight);
    var height = height_feet * 12 + height_inches;
    if (height > 24 && height < 108 && weight > 50 && weight < 800) {
        var bmi = $global.calc_bmi(height, weight);
        this.bmi = bmi;
        p_control.value = this.bmi;
    }
}
//CALCULATE BMI FOR ER VISIT OR HOSPITALIZATION MEDICAL RECORD
/*
path=er_visit_and_hospital_medical_records/maternal_biometrics/height/bmi
event=onfocus
*/
function er_hosp_bmi(p_control) {
    var bmi = null;
    var height_feet = parseFloat(this.feet);
    var height_inches = parseFloat(this.inches);
    var current_er_index = $global.get_current_multiform_index();
    var weight = parseFloat(g_data.er_visit_and_hospital_medical_records[current_er_index].maternal_biometrics.admission_weight);
    var height = height_feet * 12 + height_inches;
    if (height > 24 && height < 108 && weight > 50 && weight < 800) {
        var bmi = $global.calc_bmi(height, weight);
        this.bmi = bmi;
        p_control.value = this.bmi;
    }
}
//CALCULATE WEIGHT GAIN DURING PREGNANCY ON BC
/*
path=birth_fetal_death_certificate_parent/maternal_biometrics/weight_gain
event=onfocus
*/
function weight_gain(p_control) {
    var weight_del = parseFloat(this.weight_at_delivery);
    var weight_pp = parseFloat(this.pre_pregnancy_weight);
    if (weight_del > 50 && weight_del < 800 && weight_pp > 50 && weight_pp < 800) {
        var gain = weight_del - weight_pp;
        this.weight_gain = gain;
        p_control.value = this.weight_gain;
    }
}
//CALCULATE WEIGHT GAIN DURING PREGNANCY ) ON PC
/*
path=prenatal/current_pregnancy/weight_gain
event=onfocus
*/
function weight_gain(p_control) {
    var weight_del = parseFloat(this.weight_at_last_visit);
    var weight_pp = parseFloat(this.pre_pregnancy_weight);
    if (weight_del > 50 && weight_del < 800 && weight_pp > 50 && weight_pp < 800) {
        var gain = weight_del - weight_pp;
        this.weight_gain = gain;
        p_control.value = this.weight_gain;
    }
}
//CALCULATE INTER-BIRTH INTERVAL IN MONTHS ON BC
/*
path=birth_fetal_death_certificate_parent/pregnancy_history/live_birth_interval
event=onfocus
*/
function birth_interval(p_control) {
    var interval = null;
    var start_year = parseFloat(g_data.birth_fetal_death_certificate_parent.pregnancy_history.date_of_last_live_birth.year);
    var start_month = parseFloat(g_data.birth_fetal_death_certificate_parent.pregnancy_history.date_of_last_live_birth.month);
    var start_day = parseFloat(g_data.birth_fetal_death_certificate_parent.pregnancy_history.date_of_last_live_birth.day);
    var event_year = parseFloat(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.year);
    var event_month = parseFloat(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.month);
    var event_day = parseFloat(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.day);
    if ($global.isValidDate(start_year, start_month, start_day) == true && $global.isValidDate(event_year, event_month, event_day) == true) {
        var start_date = new Date(start_year, start_month - 1, start_day);
        var event_date = new Date(event_year, event_month - 1, event_day);
        interval = Math.trunc($global.calc_days(start_date, event_date) / 30.4375);
        this.live_birth_interval = interval;
        p_control.value = this.live_birth_interval;
    }
}
//CALCULATE INTER-PREGNANCY INTERVAL IN MONTHS ON BC
/*
path=birth_fetal_death_certificate_parent/pregnancy_history/pregnancy_interval
event=onfocus
*/
function pregnancy_interval(p_control) {
    var interval = null;
    var fd_year = parseFloat(g_data.birth_fetal_death_certificate_parent.pregnancy_history.date_of_last_other_outcome.year);
    var fd_month = parseFloat(g_data.birth_fetal_death_certificate_parent.pregnancy_history.date_of_last_other_outcome.month);
    var fd_day = parseFloat(g_data.birth_fetal_death_certificate_parent.pregnancy_history.date_of_last_other_outcome.day);
    var lb_year = parseFloat(g_data.birth_fetal_death_certificate_parent.pregnancy_history.date_of_last_live_birth.year);
    var lb_month = parseFloat(g_data.birth_fetal_death_certificate_parent.pregnancy_history.date_of_last_live_birth.month);
    var lb_day = parseFloat(g_data.birth_fetal_death_certificate_parent.pregnancy_history.date_of_last_live_birth.day);
    var event_year = parseFloat(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.year);
    var event_month = parseFloat(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.month);
    var event_day = parseFloat(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.day);
    if ($global.isValidDate(fd_year, fd_month, fd_day) == true && $global.isValidDate(event_year, event_month, event_day) == true) {
        var fd_date = new Date(fd_year, fd_month - 1, fd_day);
        var event_date = new Date(event_year, event_month - 1, event_day);
        interval = Math.trunc($global.calc_days(fd_date, event_date) / 30.4375);
        this.pregnancy_interval = interval;
        p_control.value = this.pregnancy_interval;
    } else if ($global.isValidDate(lb_year, lb_month, lb_day) == true && $global.isValidDate(event_year, event_month, event_day) == true) {
        var lb_date = new Date(lb_year, lb_month - 1, lb_day);
        var event_date = new Date(event_year, event_month - 1, event_day);
        interval = Math.trunc($global.calc_days(lb_date, end_date) / 30.4375);
        this.pregnancy_interval = interval;
        p_control.value = this.pregnancy_interval;
    }
}
// CALCULATE DISTANCE FROM PLACE OF LAST RESIDENCE TO PLACE OF DEATH 
/*
path=death_certificate/address_of_death/cmd_calculate_distance
event=onclick
*/
function death_distance(p_control) {
    var dist = null;
    var res_lat = parseFloat(g_data.death_certificate.place_of_last_residence.latitude);
    var res_lon = parseFloat(g_data.death_certificate.place_of_last_residence.longitude);
    var hos_lat = parseFloat(this.latitude);
    var hos_lon = parseFloat(this.longitude);
    if (res_lat >= -90 && res_lat <= 90 && res_lon >= -180 && res_lon <= 180 && hos_lat >= -90 && hos_lat <= 90 && hos_lon >= -180 && hos_lon <= 180) {
        dist = $global.calc_distance(res_lat, res_lon, hos_lat, hos_lon);
        this.estimated_death_distance_from_residence = dist;
        $mmria.save_current_record();
        $mmria.set_control_value('death_certificate/address_of_death/estimated_death_distance_from_residence', this.estimated_death_distance_from_residence);
    }
}
// CALCULATE DISTANCE FROM PLACE OF RESIDENCE TO HOSPITAL OF DELIVERY OF INFANT
/*
path=birth_fetal_death_certificate_parent/location_of_residence/cmd_calc_distance
event=onclick
*/
function birth_distance(p_control) {
    var dist = null;
    var res_lat = parseFloat(this.latitude);
    var res_lon = parseFloat(this.longitude);
    var hos_lat = parseFloat(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_location.latitude);
    var hos_lon = parseFloat(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_location.longitude);
    if (res_lat >= -90 && res_lat <= 90 && res_lon >= -180 && res_lon <= 180 && hos_lat >= -90 && hos_lat <= 90 && hos_lon >= -180 && hos_lon <= 180) {
        dist = $global.calc_distance(res_lat, res_lon, hos_lat, hos_lon);
        this.estimated_distance_from_residence = dist;
        $mmria.save_current_record();
        $mmria.set_control_value('birth_fetal_death_certificate_parent/location_of_residence/estimated_distance_from_residence', this.estimated_distance_from_residence);
    }
}
//CALCULATE DAYS BETWEEN BIRTH OF CHILD AND DEATH OF MOM
/*
path=birth_fetal_death_certificate_parent/cmd_length_between_child_birth_and_death_of_mother
event=onclick
*/
function birth_2_death(p_control) {
    var days = null;
    var start_year = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.year);
    var start_month = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.month);
    var start_day = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.day);
    var end_year = parseInt(g_data.home_record.date_of_death.year);
    var end_month = parseInt(g_data.home_record.date_of_death.month);
    var end_day = parseInt(g_data.home_record.date_of_death.day);
    if ($global.isValidDate(start_year, start_month, start_day) == true && $global.isValidDate(end_year, end_month, end_day) == true) {
        var start_date = new Date(start_year, start_month - 1, start_day);
        var end_date = new Date(end_year, end_month - 1, end_day);
        var days = $global.calc_days(start_date, end_date);
        this.length_between_child_birth_and_death_of_mother = days;
        $mmria.save_current_record();
        $mmria.set_control_value('birth_fetal_death_certificate_parent/length_between_child_birth_and_death_of_mother', this.length_between_child_birth_and_death_of_mother);
    }
}
//CALCULATE GESTATIONAL AGE AT BIRTH ON BC (LMP)
/*
path=birth_fetal_death_certificate_parent/prenatal_care/calculated_gestation
event=onfocus
*/
function birth_ga(p_control) {
    var ga_lmp = [];
    var weeks = null;
    var days = null;
    var event_year = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.year);
    var event_month = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.month);
    var event_day = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.day);
    var lmp_year = parseInt(g_data.birth_fetal_death_certificate_parent.prenatal_care.date_of_last_normal_menses.year);
    var lmp_month = parseInt(g_data.birth_fetal_death_certificate_parent.prenatal_care.date_of_last_normal_menses.month);
    var lmp_day = parseInt(g_data.birth_fetal_death_certificate_parent.prenatal_care.date_of_last_normal_menses.day);
    var lmp_date = new Date(lmp_year, lmp_month - 1, lmp_day);
    var event_date = new Date(event_year, event_month - 1, event_day);
    if ($global.isValidDate(event_year, event_month, event_day) == true && $global.isValidDate(lmp_year, lmp_month, lmp_day) == true) {
        ga_lmp = $global.calc_ga_lmp(lmp_date, event_date);
        if (ga_lmp.length > 1) {
            this.calculated_gestation = ga_lmp[0];
            this.calculated_gestation_days = ga_lmp[1];
            $mmria.save_current_record();
            $mmria.set_control_value('birth_fetal_death_certificate_parent/prenatal_care/calculated_gestation', ga_lmp[0]);
            $mmria.set_control_value('birth_fetal_death_certificate_parent/prenatal_care/calculated_gestation_days', ga_lmp[1]);
        }
    }
}
//CALCULATE GESTATIONAL AGE AT LAST PRENATAL VISIT (LMP OR EDD) ON PC
/*
path=prenatal/current_pregnancy/date_of_last_prenatal_visit/gestational_age_at_last_prenatal_visit
event=onfocus
*/
function prenatal_last_ga(p_control) {
    var ga = [];
    var weeks = null;
    var days = null;
    var event_year = parseInt(this.year);
    var event_month = parseInt(this.month);
    var event_day = parseInt(this.day);
    var edd_year = parseInt(g_data.prenatal.current_pregnancy.estimated_date_of_confinement.year);
    var edd_month = parseInt(g_data.prenatal.current_pregnancy.estimated_date_of_confinement.month);
    var edd_day = parseInt(g_data.prenatal.current_pregnancy.estimated_date_of_confinement.day);
    var lmp_year = parseInt(g_data.prenatal.current_pregnancy.date_of_last_normal_menses.year);
    var lmp_month = parseInt(g_data.prenatal.current_pregnancy.date_of_last_normal_menses.month);
    var lmp_day = parseInt(g_data.prenatal.current_pregnancy.date_of_last_normal_menses.day);
    var edd_date = new Date(edd_year, edd_month - 1, edd_day);
    var lmp_date = new Date(lmp_year, lmp_month - 1, lmp_day);
    var event_date = new Date(event_year, event_month - 1, event_day);
    if ($global.isValidDate(event_year, event_month, event_day) == true && $global.isValidDate(edd_year, edd_month, edd_day) == true) {
        ga = $global.calc_ga_edd(event_date, edd_date);
        if (ga.length > 1) {
            this.gestational_age_at_last_prenatal_visit = ga[0];
            this.gestational_age_at_last_prenatal_visit_days = ga[1];
            $mmria.save_current_record();
            $mmria.set_control_value('prenatal/current_pregnancy/date_of_last_prenatal_visit/gestational_age_at_last_prenatal_visit', ga[0]);
            $mmria.set_control_value('prenatal/current_pregnancy/date_of_last_prenatal_visit/gestational_age_at_last_prenatal_visit_days', ga[1]);
        }
    } else if ($global.isValidDate(event_year, event_month, event_day) == true && $global.isValidDate(lmp_year, lmp_month, lmp_day) == true) {
        ga = $global.calc_ga_lmp(lmp_date, event_date);
        if (ga.length > 1) {
            this.gestational_age_at_last_prenatal_visit = ga[0];
            this.gestational_age_at_last_prenatal_visit_days = ga[1];
            $mmria.save_current_record();
            $mmria.set_control_value('prenatal/current_pregnancy/date_of_last_prenatal_visit/gestational_age_at_last_prenatal_visit', ga[0]);
            $mmria.set_control_value('prenatal/current_pregnancy/date_of_last_prenatal_visit/gestational_age_at_last_prenatal_visit_days', ga[1]);
        }
    }
}
//CALCULATE GESTATIONAL AGE AT 1ST PRENATAL VISIT (LMP OR EDD) ON PC
/*
path=prenatal/current_pregnancy/date_of_1st_prenatal_visit/gestational_age_weeks
event=onfocus
*/
function prenatal_last_ga(p_control) {
    var ga = [];
    var weeks = null;
    var days = null;
    var event_year = parseInt(this.year);
    var event_month = parseInt(this.month);
    var event_day = parseInt(this.day);
    var edd_year = parseInt(g_data.prenatal.current_pregnancy.estimated_date_of_confinement.year);
    var edd_month = parseInt(g_data.prenatal.current_pregnancy.estimated_date_of_confinement.month);
    var edd_day = parseInt(g_data.prenatal.current_pregnancy.estimated_date_of_confinement.day);
    var lmp_year = parseInt(g_data.prenatal.current_pregnancy.date_of_last_normal_menses.year);
    var lmp_month = parseInt(g_data.prenatal.current_pregnancy.date_of_last_normal_menses.month);
    var lmp_day = parseInt(g_data.prenatal.current_pregnancy.date_of_last_normal_menses.day);
    var edd_date = new Date(edd_year, edd_month - 1, edd_day);
    var lmp_date = new Date(lmp_year, lmp_month - 1, lmp_day);
    var event_date = new Date(event_year, event_month - 1, event_day);
    if ($global.isValidDate(event_year, event_month, event_day) == true && $global.isValidDate(edd_year, edd_month, edd_day) == true) {
        ga = $global.calc_ga_edd(event_date, edd_date);
        if (ga.length > 1) {
            this.gestational_age_weeks = ga[0];
            this.gestational_age_days = ga[1];
            $mmria.save_current_record();
            $mmria.set_control_value('prenatal/current_pregnancy/date_of_1st_prenatal_visit/gestational_age_weeks', ga[0]);
            $mmria.set_control_value('prenatal/current_pregnancy/date_of_1st_prenatal_visit/gestational_age_days', ga[1]);
        }
    } else if ($global.isValidDate(event_year, event_month, event_day) == true && $global.isValidDate(lmp_year, lmp_month, lmp_day) == true) {
        ga = $global.calc_ga_lmp(lmp_date, event_date);
        if (ga.length > 1) {
            this.gestational_age_weeks = ga[0];
            this.gestational_age_days = ga[1];
            $mmria.save_current_record();
            $mmria.set_control_value('prenatal/current_pregnancy/date_of_1st_prenatal_visit/gestational_age_weeks', ga[0]);
            $mmria.set_control_value('prenatal/current_pregnancy/date_of_1st_prenatal_visit/gestational_age_days', ga[1]);
        }
    }
}
//CALCULATE POST-PARTUM DAYS ON ER-HOSPITAL FORM AT ARRIVAL
/*
path=er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_arrival/days_postpartum
event=onfocus
*/
function eha_days_postpartum(p_control) {
    var days = null;
    var start_year = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.year);
    var start_month = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.month);
    var start_day = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.day);
    var end_year = parseInt(this.year);
    var end_month = parseInt(this.month);
    var end_day = parseInt(this.day);
    var start_date = new Date(start_year, start_month - 1, start_day);
    var end_date = new Date(end_year, end_month - 1, end_day);
    if ($global.isValidDate(start_year, start_month, start_day) == true && $global.isValidDate(end_year, end_month, end_day) == true && start_date <= end_date) {
        days = $global.calc_days(start_date, end_date);
        this.days_postpartum = days;
        p_control.value = this.days_postpartum;
    }
}
//CALCULATE POST-PARTUM DAYS ON ER-HOSPITAL FORM AT ADMISSION
/*
path=er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_hospital_admission/days_postpartum
event=onfocus
*/
function eha_days_postpartum(p_control) {
    var days = null;
    var start_year = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.year);
    var start_month = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.month);
    var start_day = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.day);
    var end_year = parseInt(this.year);
    var end_month = parseInt(this.month);
    var end_day = parseInt(this.day);
    var start_date = new Date(start_year, start_month - 1, start_day);
    var end_date = new Date(end_year, end_month - 1, end_day);
    if ($global.isValidDate(start_year, start_month, start_day) == true && $global.isValidDate(end_year, end_month, end_day) == true && start_date <= end_date) {
        days = $global.calc_days(start_date, end_date);
        this.days_postpartum = days;
        p_control.value = this.days_postpartum;
    }
}
//CALCULATE POST-PARTUM DAYS ON ER-HOSPITAL FORM AT DISCHARGE
/*
path=er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_hospital_discharge/days_postpartum
event=onfocus
*/
function ehd_days_postpartum(p_control) {
    var days = null;
    var start_year = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.year);
    var start_month = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.month);
    var start_day = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.day);
    var end_year = parseInt(this.year);
    var end_month = parseInt(this.month);
    var end_day = parseInt(this.day);
    var start_date = new Date(start_year, start_month - 1, start_day);
    var end_date = new Date(end_year, end_month - 1, end_day);
    if ($global.isValidDate(start_year, start_month, start_day) == true && $global.isValidDate(end_year, end_month, end_day) == true && start_date <= end_date) {
        days = $global.calc_days(start_date, end_date);
        this.days_postpartum = days;
        p_control.value = this.days_postpartum;
    }
}
//CALCULATE DAYS POST-PARTUM ON OFFICE VISIT FORM
/*
path=other_medical_office_visits/visit/date_of_medical_office_visit/days_postpartum
event=onfocus
*/
function ehd_days_postpartum(p_control) {
    var days = null;
    var start_year = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.year);
    var start_month = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.month);
    var start_day = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.day);
    var end_year = parseInt(this.year);
    var end_month = parseInt(this.month);
    var end_day = parseInt(this.day);
    var start_date = new Date(start_year, start_month - 1, start_day);
    var end_date = new Date(end_year, end_month - 1, end_day);
    if ($global.isValidDate(start_year, start_month, start_day) == true && $global.isValidDate(end_year, end_month, end_day) == true && start_date <= end_date) {
        days = $global.calc_days(start_date, end_date);
        this.days_postpartum = days;
        p_control.value = this.days_postpartum;
    }
}
//CALCULATE DAYS POST-PARTUM IN MEDICAL TRANSPORT FORM 
/*
path=medical_transport/date_of_transport/days_postpartum
event=onfocus
*/
function mt_days_postpartum(p_control) {
    var days = null;
    var end_year = parseInt(this.year);
    var end_month = parseInt(this.month);
    var end_day = parseInt(this.day);
    var start_year = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.year);
    var start_month = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.month);
    var start_day = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.day);
    var start_date = new Date(start_year, start_month - 1, start_day);
    var end_date = new Date(end_year, end_month - 1, end_day);
    if ($global.isValidDate(start_year, start_month, start_day) == true && $global.isValidDate(end_year, end_month, end_day) == true && start_date <= end_date) {
        days = $global.calc_days(start_date, end_date);
        this.days_postpartum = days;
        p_control.value = this.days_postpartum;
    }
}
//CALCULATE DAYS POST-PARTUM IN MENTAL HEALTH FORM IN MENTAL HEALTH CONDITIONS GRID
/*
path=mental_health_profile/were_there_documented_mental_health_conditions/days_postpartum
event=onfocus
*/
function mh_days_postpartum(p_control) {
    var days = null;
    var start_year = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.year);
    var start_month = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.month);
    var start_day = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.day);
    var start_date = new Date(start_year, start_month - 1, start_day);
    if ($global.isValidDate(start_year, start_month, start_day) == true && this.date_of_screening != null && this.date_of_screening != '') {
        if (this.date instanceof Date && start_date <= this.date_of_screening) {
            days = $global.calc_days(start_date, this.date_of_screening);
        } else {
            var end_date = new Date(this.date_of_screening);
            if (start_date <= end_date) {
                days = $global.calc_days(start_date, end_date);
            }
        }
        this.days_postpartum = days;
        p_control.value = this.days_postpartum;
    }
}
//CALCULATE GESTATIONAL AGE IN ER-HOSPITALIZATION FORM AT ARRIVAL
/*
path=er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_arrival/gestational_age_weeks
event=onfocus
*/
function er_hosp_arrival_ga(p_control) {
    var ga = [];
    var weeks = null;
    var days = null;
    var current_er_index = $global.get_current_multiform_index();
    var event_year = parseInt(this.year);
    var event_month = parseInt(this.month);
    var event_day = parseInt(this.day);
    var edd_year = parseInt(g_data.prenatal.current_pregnancy.estimated_date_of_confinement.year);
    var edd_month = parseInt(g_data.prenatal.current_pregnancy.estimated_date_of_confinement.month);
    var edd_day = parseInt(g_data.prenatal.current_pregnancy.estimated_date_of_confinement.day);
    var lmp_year = parseInt(g_data.prenatal.current_pregnancy.date_of_last_normal_menses.year);
    var lmp_month = parseInt(g_data.prenatal.current_pregnancy.date_of_last_normal_menses.month);
    var lmp_day = parseInt(g_data.prenatal.current_pregnancy.date_of_last_normal_menses.day);
    //var dob_year = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.year);
    //var dob_month = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.month); 
    //var dob_day = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.day);)
    //var dob_year = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.year);
    //var dob_month = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.month); 
    //var dob_day = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.day);)
    var edd_date = new Date(edd_year, edd_month - 1, edd_day);
    var lmp_date = new Date(lmp_year, lmp_month - 1, lmp_day);
    var event_date = new Date(event_year, event_month - 1, event_day);
    //var dob_date = new Date(dob_year, dob_month - 1, dob_year);
    //var dob_date = new Date(dob_year, dob_month - 1, dob_year);
    if ($global.isValidDate(event_year, event_month, event_day) == true && $global.isValidDate(edd_year, edd_month, edd_day) == true)
        //&& ($global.isValidDate(dob_year, dob_month, dob_day) == false || dob_date < event_date))
        //&& ($global.isValidDate(dob_year, dob_month, dob_day) == false || dob_date < event_date))
        {
            ga = $global.calc_ga_edd(event_date, edd_date);
            if (ga.length > 1) {
                this.gestational_age_weeks = ga[0];
                this.gestational_age_days = ga[1];
                $mmria.save_current_record();
                $mmria.set_control_value('er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_arrival/gestational_age_weeks', ga[0]);
                $mmria.set_control_value('er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_arrival/gestational_age_days', ga[1]);
            }
        }
    else if ($global.isValidDate(event_year, event_month, event_day) == true && $global.isValidDate(lmp_year, lmp_month, lmp_day) == true)
        //&& ($global.isValidDate(dob_year, dob_month, dob_day) == false || dob_date < event_date))
        //&& ($global.isValidDate(dob_year, dob_month, dob_day) == false || dob_date < event_date))
        {
            ga = $global.calc_ga_lmp(lmp_date, event_date);
            if (ga.length > 1) {
                this.gestational_age_weeks = ga[0];
                this.gestational_age_days = ga[1];
                $mmria.save_current_record();
                $mmria.set_control_value('er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_arrival/gestational_age_weeks', ga[0]);
                $mmria.set_control_value('er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_arrival/gestational_age_days', ga[1]);
            }
        }
}
//CALCULATE GESTATIONAL AGE IN ER-HOSPITALIZATION FORM AT ADMISSION
/*
path=er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_hospital_admission/gestational_age_weeks
event=onfocus
*/
function er_hosp_admission_ga(p_control) {
    var ga = [];
    var weeks = null;
    var days = null;
    var current_er_index = $global.get_current_multiform_index();
    var event_year = parseInt(this.year);
    var event_month = parseInt(this.month);
    var event_day = parseInt(this.day);
    var edd_year = parseInt(g_data.prenatal.current_pregnancy.estimated_date_of_confinement.year);
    var edd_month = parseInt(g_data.prenatal.current_pregnancy.estimated_date_of_confinement.month);
    var edd_day = parseInt(g_data.prenatal.current_pregnancy.estimated_date_of_confinement.day);
    var lmp_year = parseInt(g_data.prenatal.current_pregnancy.date_of_last_normal_menses.year);
    var lmp_month = parseInt(g_data.prenatal.current_pregnancy.date_of_last_normal_menses.month);
    var lmp_day = parseInt(g_data.prenatal.current_pregnancy.date_of_last_normal_menses.day);
    //var dob_year = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.year);
    //var dob_month = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.month); 
    //var dob_day = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.day);)
    //var dob_year = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.year);
    //var dob_month = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.month); 
    //var dob_day = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.day);)
    var edd_date = new Date(edd_year, edd_month - 1, edd_day);
    var lmp_date = new Date(lmp_year, lmp_month - 1, lmp_day);
    var event_date = new Date(event_year, event_month - 1, event_day);
    //var dob_date = new Date(dob_year, dob_month - 1, dob_year);
    //var dob_date = new Date(dob_year, dob_month - 1, dob_year);
    if ($global.isValidDate(event_year, event_month, event_day) == true && $global.isValidDate(edd_year, edd_month, edd_day) == true)
        //&& ($global.isValidDate(dob_year, dob_month, dob_day) == false || dob_date < event_date))
        //&& ($global.isValidDate(dob_year, dob_month, dob_day) == false || dob_date < event_date))
        {
            ga = $global.calc_ga_edd(event_date, edd_date);
            if (ga.length > 1) {
                this.gestational_age_weeks = ga[0];
                this.gestational_age_days = ga[1];
                $mmria.save_current_record();
                $mmria.set_control_value('er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_hospital_admission/gestational_age_weeks', ga[0]);
                $mmria.set_control_value('er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_hospital_admission/gestational_age_days', ga[1]);
            }
        }
    else if ($global.isValidDate(event_year, event_month, event_day) == true && $global.isValidDate(lmp_year, lmp_month, lmp_day) == true)
        //&& ($global.isValidDate(dob_year, dob_month, dob_day) == false || dob_date < event_date))
        //&& ($global.isValidDate(dob_year, dob_month, dob_day) == false || dob_date < event_date))
        {
            ga = $global.calc_ga_lmp(lmp_date, event_date);
            if (ga.length > 1) {
                this.gestational_age_weeks = ga[0];
                this.gestational_age_days = ga[1];
                $mmria.save_current_record();
                $mmria.set_control_value('er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_hospital_admission/gestational_age_weeks', ga[0]);
                $mmria.set_control_value('er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_hospital_admission/gestational_age_days', ga[1]);
            }
        }
}
//CALCULATE GESTATIONAL AGE IN ER-HOSPITALIZATION FORM AT DISCHARGE
/*
path=er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_hospital_discharge/gestational_age_weeks
event=onfocus
*/
function er_hosp_discharge_ga(p_control) {
    var ga = [];
    var weeks = null;
    var days = null;
    var current_er_index = $global.get_current_multiform_index();
    var event_year = parseInt(this.year);
    var event_month = parseInt(this.month);
    var event_day = parseInt(this.day);
    var edd_year = parseInt(g_data.prenatal.current_pregnancy.estimated_date_of_confinement.year);
    var edd_month = parseInt(g_data.prenatal.current_pregnancy.estimated_date_of_confinement.month);
    var edd_day = parseInt(g_data.prenatal.current_pregnancy.estimated_date_of_confinement.day);
    var lmp_year = parseInt(g_data.prenatal.current_pregnancy.date_of_last_normal_menses.year);
    var lmp_month = parseInt(g_data.prenatal.current_pregnancy.date_of_last_normal_menses.month);
    var lmp_day = parseInt(g_data.prenatal.current_pregnancy.date_of_last_normal_menses.day);
    //var dob_year = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.year);
    //var dob_month = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.month); 
    //var dob_day = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.day);)
    //var dob_year = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.year);
    //var dob_month = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.month); 
    //var dob_day = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.day);)
    var edd_date = new Date(edd_year, edd_month - 1, edd_day);
    var lmp_date = new Date(lmp_year, lmp_month - 1, lmp_day);
    var event_date = new Date(event_year, event_month - 1, event_day);
    //var dob_date = new Date(dob_year, dob_month - 1, dob_year);
    //var dob_date = new Date(dob_year, dob_month - 1, dob_year);
    if ($global.isValidDate(event_year, event_month, event_day) == true && $global.isValidDate(edd_year, edd_month, edd_day) == true)
        //&& ($global.isValidDate(dob_year, dob_month, dob_day) == false || dob_date < event_date))
        //&& ($global.isValidDate(dob_year, dob_month, dob_day) == false || dob_date < event_date))
        {
            ga = $global.calc_ga_edd(event_date, edd_date);
            if (ga.length > 1) {
                this.gestational_age_weeks = ga[0];
                this.gestational_age_days = ga[1];
                $mmria.save_current_record();
                $mmria.set_control_value('er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_hospital_discharge/gestational_age_weeks', ga[0]);
                $mmria.set_control_value('er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_hospital_discharge/gestational_age_days', ga[1]);
            }
        }
    else if ($global.isValidDate(event_year, event_month, event_day) == true && $global.isValidDate(lmp_year, lmp_month, lmp_day) == true)
        //&& ($global.isValidDate(dob_year, dob_month, dob_day) == false || dob_date < event_date))
        //&& ($global.isValidDate(dob_year, dob_month, dob_day) == false || dob_date < event_date))
        {
            ga = $global.calc_ga_lmp(lmp_date, event_date);
            if (ga.length > 1) {
                this.gestational_age_weeks = ga[0];
                this.gestational_age_days = ga[1];
                $mmria.save_current_record();
                $mmria.set_control_value('er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_hospital_discharge/gestational_age_weeks', ga[0]);
                $mmria.set_control_value('er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_hospital_discharge/gestational_age_days', ga[1]);
            }
        }
}
//CALCULATE GESTATIONAL AGE FOR OTHER MEDICAL OFFICE VISITS
/*
path=other_medical_office_visits/visit/date_of_medical_office_visit/gestational_age_weeks
event=onfocus
*/
function omov_ga(p_control) {
    var ga = [];
    var weeks = null;
    var days = null;
    var current_omov_index = $global.get_current_multiform_index();
    var event_year = parseInt(this.year);
    var event_month = parseInt(this.month);
    var event_day = parseInt(this.day);
    var edd_year = parseInt(g_data.prenatal.current_pregnancy.estimated_date_of_confinement.year);
    var edd_month = parseInt(g_data.prenatal.current_pregnancy.estimated_date_of_confinement.month);
    var edd_day = parseInt(g_data.prenatal.current_pregnancy.estimated_date_of_confinement.day);
    var lmp_year = parseInt(g_data.prenatal.current_pregnancy.date_of_last_normal_menses.year);
    var lmp_month = parseInt(g_data.prenatal.current_pregnancy.date_of_last_normal_menses.month);
    var lmp_day = parseInt(g_data.prenatal.current_pregnancy.date_of_last_normal_menses.day);
    //var dob_year = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.year);
    //var dob_month = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.month); 
    //var dob_day = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.day);)
    //var dob_year = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.year);
    //var dob_month = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.month); 
    //var dob_day = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.day);)
    var edd_date = new Date(edd_year, edd_month - 1, edd_day);
    var lmp_date = new Date(lmp_year, lmp_month - 1, lmp_day);
    var event_date = new Date(event_year, event_month - 1, event_day);
    //var dob_date = new Date(dob_year, dob_month - 1, dob_year);
    //var dob_date = new Date(dob_year, dob_month - 1, dob_year);
    if ($global.isValidDate(event_year, event_month, event_day) == true && $global.isValidDate(edd_year, edd_month, edd_day) == true)
        //&& ($global.isValidDate(dob_year, dob_month, dob_day) == false || dob_date < event_date))
        //&& ($global.isValidDate(dob_year, dob_month, dob_day) == false || dob_date < event_date))
        {
            ga = $global.calc_ga_edd(event_date, edd_date);
            if (ga.length > 1) {
                this.gestational_age_weeks = ga[0];
                this.gestational_age_days = ga[1];
                $mmria.save_current_record();
                $mmria.set_control_value('other_medical_office_visits/visit/date_of_medical_office_visit/gestational_age_weeks', ga[0]);
                $mmria.set_control_value('other_medical_office_visits/visit/date_of_medical_office_visit/gestational_age_days', ga[1]);
            }
        }
    else if ($global.isValidDate(event_year, event_month, event_day) == true && $global.isValidDate(lmp_year, lmp_month, lmp_day) == true)
        //&& ($global.isValidDate(dob_year, dob_month, dob_day) == false || dob_date < event_date))
        //&& ($global.isValidDate(dob_year, dob_month, dob_day) == false || dob_date < event_date))
        {
            ga = $global.calc_ga_lmp(lmp_date, event_date);
            if (ga.length > 1) {
                this.gestational_age_weeks = ga[0];
                this.gestational_age_days = ga[1];
                $mmria.save_current_record();
                $mmria.set_control_value('other_medical_office_visits/visit/date_of_medical_office_visit/gestational_age_weeks', ga[0]);
                $mmria.set_control_value('other_medical_office_visits/visit/date_of_medical_office_visit/gestational_age_days', ga[1]);
            }
        }
}
//CALCULATE GESTATIONAL AGE FOR OTHER MEDICAL TRANSPORTS
/*
path=medical_transport/date_of_transport/gestational_age_weeks
event=onfocus
*/
function med_transport_ga(p_control) {
    var ga = [];
    var weeks = null;
    var days = null;
    var current_mt_index = $global.get_current_multiform_index();
    var event_year = parseInt(this.year);
    var event_month = parseInt(this.month);
    var event_day = parseInt(this.day);
    var edd_year = parseInt(g_data.prenatal.current_pregnancy.estimated_date_of_confinement.year);
    var edd_month = parseInt(g_data.prenatal.current_pregnancy.estimated_date_of_confinement.month);
    var edd_day = parseInt(g_data.prenatal.current_pregnancy.estimated_date_of_confinement.day);
    var lmp_year = parseInt(g_data.prenatal.current_pregnancy.date_of_last_normal_menses.year);
    var lmp_month = parseInt(g_data.prenatal.current_pregnancy.date_of_last_normal_menses.month);
    var lmp_day = parseInt(g_data.prenatal.current_pregnancy.date_of_last_normal_menses.day);
    //var dob_year = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.year);
    //var dob_month = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.month); 
    //var dob_day = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.day);)
    //var dob_year = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.year);
    //var dob_month = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.month); 
    //var dob_day = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.day);)
    var edd_date = new Date(edd_year, edd_month - 1, edd_day);
    var lmp_date = new Date(lmp_year, lmp_month - 1, lmp_day);
    var event_date = new Date(event_year, event_month - 1, event_day);
    //var dob_date = new Date(dob_year, dob_month - 1, dob_year);
    //var dob_date = new Date(dob_year, dob_month - 1, dob_year);
    if ($global.isValidDate(event_year, event_month, event_day) == true && $global.isValidDate(edd_year, edd_month, edd_day) == true)
        //&& ($global.isValidDate(dob_year, dob_month, dob_day) == false || dob_date < event_date))
        //&& ($global.isValidDate(dob_year, dob_month, dob_day) == false || dob_date < event_date))
        {
            ga = $global.calc_ga_edd(event_date, edd_date);
            if (ga.length > 1) {
                this.gestational_age_weeks = ga[0];
                this.gestational_age_days = ga[1];
                $mmria.save_current_record();
                $mmria.set_control_value('medical_transport/date_of_transport/gestational_age_weeks', ga[0]);
                $mmria.set_control_value('medical_transport/date_of_transport/gestational_age_days', ga[1]);
            }
        }
    else if ($global.isValidDate(event_year, event_month, event_day) == true && $global.isValidDate(lmp_year, lmp_month, lmp_day) == true)
        //&& ($global.isValidDate(dob_year, dob_month, dob_day) == false || dob_date < event_date))
        //&& ($global.isValidDate(dob_year, dob_month, dob_day) == false || dob_date < event_date))
        {
            ga = $global.calc_ga_lmp(lmp_date, event_date);
            if (ga.length > 1) {
                this.gestational_age_weeks = ga[0];
                this.gestational_age_days = ga[1];
                $mmria.save_current_record();
                $mmria.set_control_value('medical_transport/date_of_transport/gestational_age_weeks', ga[0]);
                $mmria.set_control_value('medical_transport/date_of_transport/gestational_age_days', ga[1]);
            }
        }
}
//GEOCODE PLACE OF LAST RESIDENCE ON DC FORM
/*
path=death_certificate/place_of_last_residence/get_coordinates
event=onclick
*/
function geocode_dc_last_res(p_control) {
    var street = this.street;
    var city = this.city;
    var state = this.state;
    var zip = this.zip_code;
    $mmria.get_geocode_info(street, city, state, zip, function (geo_data) {
        if (geo_data && geo_data.latitude && geo_data.longitude) {
            g_data.death_certificate.place_of_last_residence.latitude = geo_data.latitude;
            g_data.death_certificate.place_of_last_residence.longitude = geo_data.longitude;
            $mmria.save_current_record();
            $mmria.set_control_value('death_certificate/place_of_last_residence/latitude', g_data.death_certificate.place_of_last_residence.latitude);
            $mmria.set_control_value('death_certificate/place_of_last_residence/longitude', g_data.death_certificate.place_of_last_residence.longitude);
        }
    });
}
//GEOCODE PLACE OF INJURY ON DC FORM
/*
path=death_certificate/address_of_injury/cmd_get_coordinates
event=onclick
*/
function geocode_dc_injury_place(p_control) {
    var street = this.street;
    var city = this.city;
    var state = this.state;
    var zip = this.zip_code;
    $mmria.get_geocode_info(street, city, state, zip, function (geo_data) {
        if (geo_data && geo_data.latitude && geo_data.longitude) {
            g_data.death_certificate.address_of_injury.latitude = geo_data.latitude;
            g_data.death_certificate.address_of_injury.longitude = geo_data.longitude;
            $mmria.save_current_record();
            $mmria.set_control_value('death_certificate/address_of_injury/latitude', g_data.death_certificate.address_of_injury.latitude);
            $mmria.set_control_value('death_certificate/address_of_injury/longitude', g_data.death_certificate.address_of_injury.longitude);
        }
    });
}
//GEOCODE PLACE OF DEATH ON DC FORM
/*
path=death_certificate/address_of_death/cmd_get_coordinates
event=onclick
*/
function geocode_dc_death_place(p_control) {
    var street = this.street;
    var city = this.city;
    var state = this.state;
    var zip = this.zip_code;
    $mmria.get_geocode_info(street, city, state, zip, function (geo_data) {
        if (geo_data && geo_data.latitude && geo_data.longitude) {
            g_data.death_certificate.address_of_death.latitude = geo_data.latitude;
            g_data.death_certificate.address_of_death.longitude = geo_data.longitude;
            $mmria.save_current_record();
            $mmria.set_control_value('death_certificate/address_of_death/latitude', g_data.death_certificate.address_of_death.latitude);
            $mmria.set_control_value('death_certificate/address_of_death/longitude', g_data.death_certificate.address_of_death.longitude);
        }
    });
}
//GEOCODE FACILITY OF DELIVERY ON BC-PARENT FORM
/*
path=birth_fetal_death_certificate_parent/facility_of_delivery_location/cmd_get_coordinates
event=onclick
*/
function geocode_bc_delivery_place(p_control) {
    var street = this.street;
    var city = this.city;
    var state = this.state;
    var zip = this.zip_code;
    $mmria.get_geocode_info(street, city, state, zip, function (geo_data) {
        if (geo_data && geo_data.latitude && geo_data.longitude) {
            g_data.birth_fetal_death_certificate_parent.facility_of_delivery_location.latitude = geo_data.latitude;
            g_data.birth_fetal_death_certificate_parent.facility_of_delivery_location.longitude = geo_data.longitude;
            $mmria.save_current_record();
            $mmria.set_control_value('birth_fetal_death_certificate_parent/facility_of_delivery_location/latitude', g_data.birth_fetal_death_certificate_parent.facility_of_delivery_location.latitude);
            $mmria.set_control_value('birth_fetal_death_certificate_parent/facility_of_delivery_location/longitude', g_data.birth_fetal_death_certificate_parent.facility_of_delivery_location.longitude);
        }
    });
}
//GEOCODE LOCATION OF MOTHERS RESIDENCE ON BC-PARENT FORM
/*
path=birth_fetal_death_certificate_parent/location_of_residence/cmd_get_coordinates
event=onclick
*/
function geocode_bc_residence(p_control) {
    var street = this.street;
    var city = this.city;
    var state = this.state;
    var zip = this.zip_code;
    $mmria.get_geocode_info(street, city, state, zip, function (geo_data) {
        if (geo_data && geo_data.latitude && geo_data.longitude) {
            g_data.birth_fetal_death_certificate_parent.location_of_residence.latitude = geo_data.latitude;
            g_data.birth_fetal_death_certificate_parent.location_of_residence.longitude = geo_data.longitude;
            $mmria.save_current_record();
            $mmria.set_control_value('birth_fetal_death_certificate_parent/location_of_residence/latitude', g_data.birth_fetal_death_certificate_parent.location_of_residence.latitude);
            $mmria.set_control_value('birth_fetal_death_certificate_parent/location_of_residence/longitude', g_data.birth_fetal_death_certificate_parent.location_of_residence.longitude);
        }
    });
}
//GEOCODE LOCATION OF PRIMARY PRENATAL CARE FACILITY ON PC FORM
/*
path=prenatal/location_of_primary_prenatal_care_facility/cmd_get_coordinates
event=onclick
*/
function geocode_pc_primary_care_location(p_control) {
    var street = this.street;
    var city = this.city;
    var state = this.state;
    var zip = this.zip_code;
    $mmria.get_geocode_info(street, city, state, zip, function (geo_data) {
        if (geo_data && geo_data.latitude && geo_data.longitude) {
            g_data.prenatal.location_of_primary_prenatal_care_facility.latitude = geo_data.latitude;
            g_data.prenatal.location_of_primary_prenatal_care_facility.longitude = geo_data.longitude;
            $mmria.save_current_record();
            $mmria.set_control_value('prenatal/location_of_primary_prenatal_care_facility/latitude', g_data.prenatal.location_of_primary_prenatal_care_facility.latitude);
            $mmria.set_control_value('prenatal/location_of_primary_prenatal_care_facility/longitude', g_data.prenatal.location_of_primary_prenatal_care_facility.longitude);
        }
    });
}
//GEOCODE LOCATION OF HOSPITAL ON ER-HOSPITALIZATIONS FORM
/*
path=er_visit_and_hospital_medical_records/name_and_location_facility/get_coordinates
event=onclick
*/
function geocode_erh_location(p_control) {
    var street = this.street;
    var city = this.city;
    var state = this.state;
    var zip = this.zip_code;
    var current_erh_index = $global.get_current_multiform_index();
    $mmria.get_geocode_info(street, city, state, zip, function (geo_data) {
        if (geo_data && geo_data.latitude && geo_data.longitude) {
            g_data.er_visit_and_hospital_medical_records[current_erh_index].name_and_location_facility.latitude = geo_data.latitude;
            g_data.er_visit_and_hospital_medical_records[current_erh_index].name_and_location_facility.longitude = geo_data.longitude;
            $mmria.save_current_record();
            $mmria.set_control_value('er_visit_and_hospital_medical_records/name_and_location_facility/latitude', g_data.er_visit_and_hospital_medical_records.name_and_location_facility.latitude);
            $mmria.set_control_value('er_visit_and_hospital_medical_records/name_and_location_facility/longitude', g_data.er_visit_and_hospital_medical_records.name_and_location_facility.longitude);
        }
    });
}
//GEOCODE LOCATION OF OFFICE ON OTHER MEDICAL VISITS FORM
/*
path=other_medical_office_visits/location_of_medical_care_facility/get_coordinates
event=onclick
*/
function geocode_omov_location(p_control) {
    var street = this.street;
    var city = this.city;
    var state = this.state;
    var zip = this.zip_code;
    var current_omov_index = $global.get_current_multiform_index();
    $mmria.get_geocode_info(street, city, state, zip, function (geo_data) {
        if (geo_data && geo_data.latitude && geo_data.longitude) {
            g_data.other_medical_office_visits[current_omov_index].location_of_medical_care_facility.latitude = geo_data.latitude;
            g_data.other_medical_office_visits[current_omov_index].location_of_medical_care_facility.longitude = geo_data.longitude;
            $mmria.save_current_record();
            $mmria.set_control_value('other_medical_office_visits/location_of_medical_care_facility/latitude', g_data.other_medical_office_visits.location_of_medical_care_facility.latitude);
            $mmria.set_control_value('other_medical_office_visits/location_of_medical_care_facility/longitude', g_data.other_medical_office_visits.location_of_medical_care_facility.longitude);
        }
    });
}
//CALCULATE GESTATIONAL AGE IN PC RECORD ROUTINE MONITORING GRID
/*
path=prenatal/routine_monitoring/gestational_age_weeks
event=onfocus
*/
function pc_rm_ga(p_control) {
    var ga = [];
    var weeks = null;
    var days = null;
    var current_pcrm_index = $global.get_current_multiform_index();
    var edd_year = parseInt(g_data.prenatal.current_pregnancy.estimated_date_of_confinement.year);
    var edd_month = parseInt(g_data.prenatal.current_pregnancy.estimated_date_of_confinement.month);
    var edd_day = parseInt(g_data.prenatal.current_pregnancy.estimated_date_of_confinement.day);
    var lmp_year = parseInt(g_data.prenatal.current_pregnancy.date_of_last_normal_menses.year);
    var lmp_month = parseInt(g_data.prenatal.current_pregnancy.date_of_last_normal_menses.month);
    var lmp_day = parseInt(g_data.prenatal.current_pregnancy.date_of_last_normal_menses.day);
    var edd_date = new Date(edd_year, edd_month - 1, edd_day);
    var lmp_date = new Date(lmp_year, lmp_month - 1, lmp_day);
    if (this.date_and_time instanceof Date) {
        var event_date = this.date_and_time;
    } else {
        var event_date = new Date(this.this.date_and_time);
    }
    if ($global.isValidDate(edd_year, edd_month, edd_day) == true && this.date_and_time != '' || this.date_and_time != null) {
        ga = $global.calc_ga_edd(event_date, edd_date);
        if (ga.length > 1) {
            this.gestational_age_weeks = ga[0];
            this.gestational_age_days = ga[1];
            $mmria.save_current_record();
            $mmria.set_control_value('prenatal/routine_monitoring/gestational_age_weeks', ga[0]);
            $mmria.set_control_value('prenatal/routine_monitoring/gestational_age_days', ga[1]);
        }
    } else if ($global.isValidDate(lmp_year, lmp_month, lmp_day) == true && this.date_and_time != '' || this.date_and_time != null) {
        ga = $global.calc_ga_lmp(lmp_date, event_date);
        if (ga.length > 1) {
            this.gestational_age_weeks = ga[0];
            this.gestational_age_days = ga[1];
            $mmria.save_current_record();
            $mmria.set_control_value('prenatal/routine_monitoring/gestational_age_weeks', ga[0]);
            $mmria.set_control_value('prenatal/routine_monitoring/gestational_age_days', ga[1]);
        }
    }
}
//CALCULATE TIME BETWEEN ONSET OF LABOR AND ARRIVAL AT HOSPITAL
/*
path=er_visit_and_hospital_medical_records/onset_of_labor/date_of_onset_of_labor/cmd_duration_of_labor_prior_to_arrival
event=onclick
*/
function duration_of_labor(p_control) {
    var hours = null;
    var current_dol_index = $global.get_current_multiform_index();
    var onset_year = parseInt(this.year);
    var onset_month = parseInt(this.month);
    var onset_day = parseInt(this.day);
    if (this.time_of_onset_of_labor instanceof Date) {
        var onset_time = this.time_of_onset_of_labor;
    } else {
        var onset_time = new Date('January 1, 1900 ' + this.time_of_onset_of_labor);
    }
    var arrival_year = parseInt(g_data.er_visit_and_hospital_medical_records[current_dol_index].basic_admission_and_discharge_information.date_of_arrival.year);
    var arrival_month = parseInt(g_data.er_visit_and_hospital_medical_records[current_dol_index].basic_admission_and_discharge_information.date_of_arrival.month);
    var arrival_day = parseInt(g_data.er_visit_and_hospital_medical_records[current_dol_index].basic_admission_and_discharge_information.date_of_arrival.day);
    if (this.time_of_onset_of_labor instanceof Date) {
        var arrival_time = g_data.er_visit_and_hospital_medical_records[current_dol_index].basic_admission_and_discharge_information.date_of_arrival.time_of_arrival;
    } else {
        var arrival_time = new Date('January 1, 1900 ' + g_data.er_visit_and_hospital_medical_records[current_dol_index].basic_admission_and_discharge_information.date_of_arrival.time_of_arrival);
    }
    if ($global.isValidDate(onset_year, onset_month, onset_day) == true && $global.isValidDate(arrival_year, arrival_month, arrival_day) == true && (this.time_of_onset_of_labor != '' || this.time_of_onset_of_labor != null) && (g_data.er_visit_and_hospital_medical_records[current_dol_index].basic_admission_and_discharge_information.date_of_arrival.time_of_arrival != '' || g_data.er_visit_and_hospital_medical_records[current_dol_index].basic_admission_and_discharge_information.date_of_arrival.time_of_arrival_time != null)) {
        var onset_date = new Date(onset_year, onset_month - 1, onset_day, onset_time.getHours(), onset_time.getMinutes());
        var arrival_date = new Date(arrival_year, arrival_month - 1, arrival_day, arrival_time.getHours(), arrival_time.getMinutes());
        var hours = Math.round((arrival_date - onset_date) / 3600000 * 100) / 100;
        if (hours.length > 1) {
            this.duration_of_labor_prior_to_arrival = hours;
            $mmria.save_current_record();
            $mmria.set_control_value('er_visit_and_hospital_medical_records/onset_of_labor/date_of_onset_of_labor/duration_of_labor_prior_to_arrival', this.duration_of_labor_prior_to_arrival);
        }
    }
}
// OMB RACE RECODE FOR CASE ON DC FORM
/*
path=death_certificate/race/cmd_recode
event=onclick
*/
function omb_race_recode_dc(p_control) {
    var race_recode = null;
    var race = this.race;
    race_recode = $global.calculate_omb_recode(race);
    this.omb_race_recode = race_recode;
    $mmria.save_current_record();
    $mmria.set_control_value('death_certificate/race/omb_race_recode', this.omb_race_recode);
}
// OMB RACE RECODE FOR MOM ON BC FORM
/*
path=birth_fetal_death_certificate_parent/race/cmd_recode
event=onclick
*/
function omb_mrace_recode_bc(p_control) {
    var race_recode = null;
    var race = this.race_of_mother;
    race_recode = $global.calculate_omb_recode(race);
    this.omb_race_recode = race_recode;
    $mmria.save_current_record();
    $mmria.set_control_value('birth_fetal_death_certificate_parent/race/omb_race_recode', this.omb_race_recode);
}
// OMB RACE RECODE FOR DAD ON BC FORM
/*
path=birth_fetal_death_certificate_parent/demographic_of_father/race/cmd_recode
event=onclick
*/
function omb_frace_recode_bc(p_control) {
    var race_recode = null;
    var race = this.race_of_father;
    race_recode = $global.calculate_omb_recode(race);
    this.omb_race_recode = race_recode;
    $mmria.save_current_record();
    $mmria.set_control_value('birth_fetal_death_certificate_parent/demographic_of_father/race/omb_race_recode', this.omb_race_recode);
}
// CLEAR OMB RACE RECODE FOR CASE ON DC FORM
/*
path=death_certificate/race/cmd_recode_clear
event=onclick
*/
function omb_race_clear_dc(p_control) {
    this.omb_race_recode = '';
    $mmria.save_current_record();
    $mmria.set_control_value('death_certificate/race/omb_race_recode', this.omb_race_recode);
}
// CLEAR OMB RACE RECODE FOR MOM ON BC FORM
/*
path=birth_fetal_death_certificate_parent/race/cmd_recode_clear
event=onclick
*/
function omb_mrace_clear_bc(p_control) {
    this.omb_race_recode = '';
    $mmria.save_current_record();
    $mmria.set_control_value('birth_fetal_death_certificate_parent/race/omb_race_recode', this.omb_race_recode);
}
// CLEAR OMB RACE RECODE FOR DAD ON BC FORM
/*
path=birth_fetal_death_certificate_parent/demographic_of_father/race/cmd_recode_clear
event=onclick
*/
function omb_frace_clear_bc(p_control) {
    this.omb_race_recode = '';
    $mmria.save_current_record();
    $mmria.set_control_value('birth_fetal_death_certificate_parent/demographic_of_father/race/omb_race_recode', this.omb_race_recode);
}
// CLEAR DISTANCE BETWEEN LAST RESIDENCE AND HOSPITAL OF DEATH ON DC FORM
/*
path=death_certificate/address_of_death/cmd_calculate_distance_clear
event=onclick
*/
function distance_clear_dc(p_control) {
    this.estimated_death_distance_from_residence = '';
    $mmria.save_current_record();
    $mmria.set_control_value('death_certificate/address_of_death/estimated_death_distance_from_residence', this.estimated_death_distance_from_residence);
}
// CLEAR DISTANCE BETWEEN LAST RESIDENCE AND HOSPITAL OF DELIVERY ON BC FORM
/*
path=birth_fetal_death_certificate_parent/location_of_residence/cmd_calc_distance_clear
event=onclick
*/
function distance_clear_bc(p_control) {
    this.estimated_distance_from_residence = '';
    $mmria.save_current_record();
    $mmria.set_control_value('birth_fetal_death_certificate_parent/location_of_residence/estimated_distance_from_residence', this.estimated_distance_from_residence);
}
// CLEAR DAYS BETWEEN BIRTH OF INFANT AND DEAT OF MOTHER ON BC FORM
/*
path=birth_fetal_death_certificate_parent/cmd_length_between_child_birth_and_death_of_mother_clear
event=onclick
*/
function days_clear_bc(p_control) {
    this.length_between_child_birth_and_death_of_mother = '';
    $mmria.save_current_record();
    $mmria.set_control_value('birth_fetal_death_certificate_parent/length_between_child_birth_and_death_of_mother', this.length_between_child_birth_and_death_of_mother);
}
// CLEAR HOURS BETWEEN ONSET OF LABOR AND ARRIVAL ON HOSPITAL FORM
/*
path=er_visit_and_hospital_medical_records/onset_of_labor/date_of_onset_of_labor/cmd_duration_of_labor_prior_to_arrival_clear
event=onclick
*/
function hours_clear_mr(p_control) {
    this.duration_of_labor_prior_to_arrival = '';
    $mmria.save_current_record();
    $mmria.set_control_value('er_visit_and_hospital_medical_records/onset_of_labor/date_of_onset_of_labor/duration_of_labor_prior_to_arrival', this.duration_of_labor_prior_to_arrival);
}
// CLEAR COORDINATES FOR RESIDENCE ON DC FORM
/*
path=death_certificate/place_of_last_residence/get_coordinates_clear
event=onclick
*/
function coordinates_clear_res_dc(p_control) {
    this.latitude = '';
    this.longitude = '';
    $mmria.save_current_record();
    $mmria.set_control_value('death_certificate/place_of_last_residence/latitude', this.latitude);
    $mmria.set_control_value('death_certificate/place_of_last_residence/longitude', this.longitude);
}
// CLEAR COORDINATES FOR INJURY LOCATION ON DC FORM
/*
path=death_certificate/address_of_injury/cmd_get_coordinates_clear
event=onclick
*/
function coordinates_clear_inj_dc(p_control) {
    this.latitude = '';
    this.longitude = '';
    $mmria.save_current_record();
    $mmria.set_control_value('death_certificate/address_of_injury/latitude', this.latitude);
    $mmria.set_control_value('death_certificate/address_of_injury/longitude', this.longitude);
}
// CLEAR COORDINATES FOR DEATH LOCATION ON DC FORM
/*
path=death_certificate/address_of_death/cmd_get_coordinates_clear
event=onclick
*/
function coordinates_clear_death_loc_dc(p_control) {
    this.latitude = '';
    this.longitude = '';
    $mmria.save_current_record();
    $mmria.set_control_value('death_certificate/address_of_death/latitude', this.latitude);
    $mmria.set_control_value('death_certificate/address_of_death/longitude', this.longitude);
}
// CLEAR COORDINATES FOR DELIVERY LOCATION ON BC FORM
/*
path=birth_fetal_death_certificate_parent/facility_of_delivery_location/cmd_get_coordinates_clear
event=onclick
*/
function coordinates_clear_delivery_loc_bc(p_control) {
    this.latitude = '';
    this.longitude = '';
    $mmria.save_current_record();
    $mmria.set_control_value('birth_fetal_death_certificate_parent/facility_of_delivery_location/latitude', this.latitude);
    $mmria.set_control_value('birth_fetal_death_certificate_parent/facility_of_delivery_location/longitude', this.longitude);
}
// CLEAR COORDINATES FOR RESIDENCE ON BC FORM
/*
path=birth_fetal_death_certificate_parent/location_of_residence/cmd_get_coordinates_clear
event=onclick
*/
function coordinates_clear_residence_bc(p_control) {
    this.latitude = '';
    this.longitude = '';
    $mmria.save_current_record();
    $mmria.set_control_value('birth_fetal_death_certificate_parent/location_of_residence/latitude', this.latitude);
    $mmria.set_control_value('birth_fetal_death_certificate_parent/location_of_residence/longitude', this.longitude);
}
// CLEAR COORDINATES FOR PNC LOCATION ON PC FORM
/*
path=prenatal/location_of_primary_prenatal_care_facility/cmd_get_coordinates_clear
event=onclick
*/
function coordinates_clear_pnc_loc_pc(p_control) {
    this.latitude = '';
    this.longitude = '';
    $mmria.save_current_record();
    $mmria.set_control_value('prenatal/location_of_primary_prenatal_care_facility/latitude', this.latitude);
    $mmria.set_control_value('prenatal/location_of_primary_prenatal_care_facility/longitude', this.longitude);
}
// CLEAR COORDINATES FOR PNC LOCATION ON PC FORM
/*
path=prenatal/location_of_primary_prenatal_care_facility/cmd_get_coordinates_clear
event=onclick
*/
function coordinates_clear_pnc_loc_pc(p_control) {
    this.latitude = '';
    this.longitude = '';
    $mmria.save_current_record();
    $mmria.set_control_value('prenatal/location_of_primary_prenatal_care_facility/latitude', this.latitude);
    $mmria.set_control_value('prenatal/location_of_primary_prenatal_care_facility/longitude', this.longitude);
}
// CLEAR COORDINATES FOR HOSPITAL LOCATION ON MR FORM
/*
path=er_visit_and_hospital_medical_records/name_and_location_facility/get_coordinates_clear
event=onclick
*/
function coordinates_clear_hos_loc_mr(p_control) {
    this.latitude = '';
    this.longitude = '';
    $mmria.save_current_record();
    $mmria.set_control_value('er_visit_and_hospital_medical_records/name_and_location_facility/latitude', this.latitude);
    $mmria.set_control_value('er_visit_and_hospital_medical_records/name_and_location_facility/longitude', this.longitude);
}
// CLEAR COORDINATES FOR HOSPITAL LOCATION ON MR FORM
/*
path=other_medical_office_visits/location_of_medical_care_facility/get_coordinates_clear
event=onclick
*/
function coordinates_clear_office_loc_mv(p_control) {
    this.latitude = '';
    this.longitude = '';
    $mmria.save_current_record();
    $mmria.set_control_value('other_medical_office_visits/location_of_medical_care_facility/latitude', this.latitude);
    $mmria.set_control_value('other_medical_office_visits/location_of_medical_care_facility/longitude', this.longitude);
}