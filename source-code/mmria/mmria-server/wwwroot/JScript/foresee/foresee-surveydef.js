(function(){

    var FSR;

    // Do we support AMD?
    var supports_amd =
        typeof(window.define) === 'function' && window.define.amd &&
            (!window.FSR || window.FSR.supportsAMD);

    if(!supports_amd)
        FSR = window.FSR;
    else
        FSR = {};

    FSR.surveydefs = [{
    name: 'phone_web',
    section: 'npin',
    platform: 'phone',
    invite: {
        when: 'onentry',
        siteLogo: "sitelogo_npin.gif",
        // Mobile
        dialogs: [[{
            reverseButtons: false,
            headline: "We'd welcome your feedback!",
            blurb: "You have been selected to participate in a brief customer satisfaction survey to let us know how we can improve your experience.",
            attribution: "Conducted by ForeSee.",
            declineButton: "No, thanks",
            acceptButton: "Yes, I'll help",
            error: "Error",
            warnLaunch: "this will launch a new window",
            locales: {
                "es": {
                    headline: "¡Le agradecemos sus opiniones y comentarios!",
                    blurb: "Usted ha sido elegido(a) al azar para participar en una breve encuesta de satisfacción del cliente e informarnos así sobre cómo podemos mejorar su interacción con nosotros.",
                    attribution: "Realizada por ForeSee.",
                    declineButton: "No, gracias",
                    acceptButton: "Sí, deseo participar",
                    error: "Error",
                    warnLaunch: "Esto abrirá una nueva pantalla"
                }
            }
        }]]
    },
    pop: {
        when: 'now'
    },
    criteria: {
        sp: 50,
        lf: 2,
        locales: [{
            locale: 'es',
            sp: 50,
            lf: 2
        }]
    },
    include: {
        urls: ['gettested.cdc.gov', 'findtbresources.cdc.gov', 'npin.cdc.gov']
    }
}, {
    name: 'tablet_web',
    section: 'npin',
    platform: 'tablet',
    invite: {
        when: 'onentry',
        siteLogo: "sitelogo_npin.gif",
        // Mobile
        dialogs: [[{
            reverseButtons: false,
            headline: "We'd welcome your feedback!",
            blurb: "You have been selected to participate in a brief customer satisfaction survey to let us know how we can improve your experience.",
            attribution: "Conducted by ForeSee.",
            declineButton: "No, thanks",
            acceptButton: "Yes, I'll help",
            error: "Error",
            warnLaunch: "this will launch a new window",
            locales: {
                "es": {
                    headline: "¡Le agradecemos sus opiniones y comentarios!",
                    blurb: "Usted ha sido elegido(a) al azar para participar en una breve encuesta de satisfacción del cliente e informarnos así sobre cómo podemos mejorar su interacción con nosotros.",
                    attribution: "Realizada por ForeSee.",
                    declineButton: "No, gracias",
                    acceptButton: "Sí, deseo participar",
                    error: "Error",
                    warnLaunch: "Esto abrirá una nueva pantalla"
                }
            }
        }]]
    },
    pop: {
        when: 'now'
    },
    criteria: {
        sp: 50,
        lf: 2,
        locales: [{
            locale: 'es',
            sp: 50,
            lf: 2
        }]
    },
    include: {
        urls: ['gettested.cdc.gov', 'findtbresources.cdc.gov', 'npin.cdc.gov']
    }
}, {
    name: 'phone_web',
    platform: 'phone',
    invite: {
        when: 'onentry',
        // Mobile
        dialogs: [[{
            reverseButtons: false,
            headline: "We'd welcome your feedback!",
            blurb: "You have been selected to participate in a brief customer satisfaction survey to let us know how we can improve your experience.",
            attribution: "Conducted by ForeSee.",
            declineButton: "No, thanks",
            acceptButton: "Yes, I'll help",
            error: "Error",
            warnLaunch: "this will launch a new window",
            locales: {
                "es": {
                    headline: "¡Le agradecemos sus opiniones y comentarios!",
                    blurb: "Usted ha sido elegido(a) al azar para participar en una breve encuesta de satisfacción del cliente e informarnos así sobre cómo podemos mejorar su interacción con nosotros.",
                    attribution: "Realizada por ForeSee.",
                    declineButton: "No, gracias",
                    acceptButton: "Sí, deseo participar",
                    error: "Error",
                    warnLaunch: "Esto abrirá una nueva pantalla"
                }
            }
        }]]
    },
    pop: {
        when: 'now'
    },
    criteria: {
        sp: 20,
        lf: 2,
        locales: [{
            locale: 'es',
            sp: 20,
            lf: 2
        }]
    },
    include: {
        urls: ['.']
    }
}, {
    name: 'tablet_web',
    platform: 'tablet',
    invite: {
        when: 'onentry',
        // Mobile
        dialogs: [[{
            reverseButtons: false,
            headline: "We'd welcome your feedback!",
            blurb: "You have been selected to participate in a brief customer satisfaction survey to let us know how we can improve your experience.",
            attribution: "Conducted by ForeSee.",
            declineButton: "No, thanks",
            acceptButton: "Yes, I'll help",
            error: "Error",
            warnLaunch: "this will launch a new window",
            locales: {
                "es": {
                    headline: "¡Le agradecemos sus opiniones y comentarios!",
                    blurb: "Usted ha sido elegido(a) al azar para participar en una breve encuesta de satisfacción del cliente e informarnos así sobre cómo podemos mejorar su interacción con nosotros.",
                    attribution: "Realizada por ForeSee.",
                    declineButton: "No, gracias",
                    acceptButton: "Sí, deseo participar",
                    error: "Error",
                    warnLaunch: "Esto abrirá una nueva pantalla"
                }
            }
        }]]
    },
    pop: {
        when: 'now'
    },
    criteria: {
        sp: 20,
        lf: 2,
        locales: [{
            locale: 'es',
            sp: 20,
            lf: 2
        }]
    },
    include: {
        urls: ['.']
    }
}, {
    name: 'browse_npin',
    platform: 'desktop',
    invite: {
        when: 'onentry',
        siteLogo: "sitelogo_npin.gif"
    },
    pop: {
        when: 'later'
    },
    criteria: {
        sp: 50,
        lf: 2,
        locales: [{
            locale: 'es',
            sp: 50,
            lf: 2
        }]
    },
    include: {
        urls: ['gettested.cdc.gov/es', 'findtbresources.cdc.gov', 'npin.cdc.gov', 'gettested.cdc.gov']
    }
}, {
    name: 'browse_cdc',
    platform: 'desktop',
    invite: {
        when: 'onentry'
    },
    pop: {
        when: 'later'
    },
    criteria: {
        sp: 2,
        lf: 3,
        locales: [{
            locale: 'es',
            sp: 5,
            lf: 3
        }]
    },
    include: {
        urls: ['.']
    }
}];
FSR.properties = {
	repeatdays : 30,

	repeatoverride : false,

	altcookie : {},

	language : {
		locale : 'en',
		src : 'location',
		locales : [{
			match : /spanish/i,
			locale : 'es'
		}, {
			match : '/espanol/',
			locale : 'es'
		}, {
			match : '/es/',
			locale : 'es'
		}, {
			match : 'espanol',
			locale : 'es'
		}]
	},

	exclude : {},
	/* Invite branding sample property
	 brands : [{"c":"Foresee","p":33}, {"c":"Answers", "p":33}, {"c":"ForeseeByAnswers", "p":33}],
	 */
	zIndexPopup : 10000,

	ignoreWindowTopCheck : false,

	ipexclude : 'fsr$ip',

	mobileHeartbeat : {
		delay : 60, /*mobile on exit heartbeat delay seconds*/
		max : 3600 /*mobile on exit heartbeat max run time seconds*/
	},

	invite : {

		// For no site logo, comment this line:
		siteLogo : "sitelogo.gif",

		//alt text fore site logo img
		siteLogoAlt : "",

		/* Desktop */
		dialogs : [[{
			reverseButtons : false,
			headline : "We'd welcome your feedback!",
			blurb : "Thank you for visiting our website. You have been selected to participate in a brief customer satisfaction survey to let us know how we can improve your experience.",
			noticeAboutSurvey : "The survey is designed to measure your entire experience, please look for it at the <u>conclusion</u> of your visit.",
			attribution : "This survey is conducted by an independent company ForeSee, on behalf of the site you are visiting.",
			closeInviteButtonText : "Click to close.",
			declineButton : "No, thanks",
			acceptButton : "Yes, I'll give feedback",
			error : "Error",
			warnLaunch : "this will launch a new window",
			locales : {
				"es" : {
					headline : "¡Agradecemos su participación!",
					blurb : "Gracias por visitar CDC.gov. Ha sido seleccionado para participar en una breve encuesta de satisfacción del cliente que nos permite saber cómo podemos mejorar su experiencia.",
					noticeAboutSurvey : "La encuesta tiene el objetivo de medir su experiencia total en el sitio web, búsquela al <u>concluir</u> su visita.",
					attribution : "ForeSee, una empresa independiente, realiza esta encuesta en nombre del sitio que está visitando.",
					closeInviteButtonText : "Haga clic para cerrar.",
					declineButton : "No gracias",
					acceptButton : "Sí, participaré en la encuesta",
					error : "Error",
					warnLaunch : "Esto abrirá una nueva pantalla"
				}
			}

		}]],

		exclude : {
			urls : [],
			referrers : [],
			userAgents : [],
			browsers : [],
			cookies : [],
			variables : []
			// [name (content), http-equiv (content), itemprop (content),  charset] possible attributes for meta tag element http://devdocs.io/html/meta
			// metas:[{"name":{"key":"value", "content":"value"}}, {"http-equiv":{"key":"value", "content":"value"}}, {"itemprop":{"key":"value", "content":"value"}}, {"charset":{"key":"value"}}]

		},
		include : {
			local : ['.']
		},

		delay : 0,
		timeout : 0,

		hideOnClick : false,

		hideCloseButton : false,

		css : 'foresee-dhtml.css',

		hide : [],

		hideFlash : false,

		type : 'dhtml',
		/* desktop */
		// url: 'invite.html'
		/* mobile */
		url : 'invite-mobile.html',
		back : 'url'

		//SurveyMutex: 'SurveyMutex'
	},

	tracker : {
		width : '690',
		height : '415',
		timeout : 3,
		//pu: false,
		adjust : true,
		alert : {
			enabled : true,
			message : 'The survey is now available.',
			locales : [{
				locale : 'es',
				message : 'La encuesta está disponible para usted.'
			}]
		},
		url : 'tracker.html',
		locales : [{
			locale : 'es',
			url : 'tracker_es.html'
		}]
	},

	survey : {
		width : 690,
		height : 600
	},

	qualifier : {
		footer : '<div id=\"fsrcontainer\"><div style=\"float:left;width:80%;font-size:8pt;text-align:left;line-height:12px;\">This survey is conducted by an independent company ForeSee,<br>on behalf of the site you are visiting.</div><div style=\"float:right;font-size:8pt;\"><a target="_blank" title="Validate TRUSTe privacy certification" href="//privacy-policy.truste.com/click-with-confidence/ctv/en/www.foreseeresults.com/seal_m"><img border=\"0\" src=\"{%baseHref%}truste.png\" alt=\"Validate TRUSTe Privacy Certification\"></a></div></div>',
		width : '690',
		height : '500',
		bgcolor : '#333',
		opacity : 0.7,
		x : 'center',
		y : 'center',
		delay : 0,
		buttons : {
			accept : 'Continue'
		},
		hideOnClick : false,
		css : 'foresee-dhtml.css',
		url : 'qualifying.html'
	},

	cancel : {
		url : 'cancel.html',
		width : '690',
		height : '400'
	},

	pop : {
		what : 'survey',
		after : 'leaving-site',
		pu : false,
		tracker : true
	},

	meta : {
		referrer : true,
		terms : true,
		ref_url : true,
		url : true,
		url_params : false,
		user_agent : false,
		entry : false,
		entry_params : false,
		viewport_size : false,
		document_size : false,
		scroll_from_top : false,
		invite_URL : false
	},

	events : {
		enabled : true,
		id : true,
		codes : {
			purchase : 800,
			items : 801,
			dollars : 802,
			followup : 803,
			information : 804,
			content : 805
		},
		pd : 7,
		custom : {}
	},

	previous : false,

	analytics : {
		google_local : false,
		google_remote : false
	},

	cpps : {
		GovDelivery : {
			source : 'url',
			init : 'N',
			patterns : [{
				regex : 'source=govdelivery',
				value : 'Y'
			}]
		},
		TopTier : {
			source : 'url',
			patterns : [{
				regex : 'cdc.gov/$',
				value : 'Y'
			}, {
				regex : 'cdc.gov/index.htm',
				value : 'Y'
			}, {
				regex : '/az/',
				value : 'Y'
			}, {
				regex : '/contact/',
				value : 'Y'
			}, {
				regex : '/emailupdates/',
				value : 'Y'
			}, {
				regex : '/DataStatistics/',
				value : 'Y'
			}, {
				regex : '/DiseasesConditions/',
				value : 'Y'
			}, {
				regex : '/Features/',
				value : 'Y'
			}, {
				regex : '/HealthyLiving/',
				value : 'Y'
			}, {
				regex : '/Other/',
				value : 'Y'
			}, {
				regex : '/Publications/',
				value : 'Y'
			}, {
				regex : '/TemplatePackage/',
				value : 'Y'
			}, {
				regex : '/metrics/',
				value : 'Y'
			}, {
				regex : '/privacy/',
				value : 'Y'
			}, {
				regex : '/diversity/nofearact/',
				value : 'Y'
			}, {
				regex : '/widgets/',
				value : 'Y'
			}, {
				regex : '/about/',
				value : 'Y'
			}, {
				regex : '/outbreaks/',
				value : 'Y'
			}, {
				regex : '/mobile/',
				value : 'Y'
			}, {
				regex : '/syndication/',
				value : 'Y'
			}, {
				regex : '/about/',
				value : 'Y'
			}, {
				regex : '/VitalSigns/',
				value : 'Y'
			}, {
				regex : '/WinnableBattles/',
				value : 'Y'
			}, {
				regex : '/Media/',
				value : 'Y'
			}, {
				regex : '/healthcommunication/',
				value : 'Y'
			}, {
				regex : '/healthliteracy/',
				value : 'Y'
			}, {
				regex : '/grand-rounds/',
				value : 'Y'
			}, {
				regex : '/museum/',
				value : 'Y'
			}, {
				regex : '/nchcmm/',
				value : 'Y'
			}, {
				regex : '/speakers/',
				value : 'Y'
			}]
		},
		OSELS : {
			source : 'url',
			patterns : [{
				regex : '/phin/',
				value : 'Y'
			}, {
				regex : '/ehrmeaningfuluse/',
				value : 'Y'
			}, {
				regex : '/ophss/',
				value : 'Y'
			}, {
				regex : '/library/',
				value : 'Y'
			}, {
				regex : '/eis/',
				value : 'Y'
			}]
		},
		OADC : {
			source : 'url',
			patterns : [{
				regex : '/socialmedia/',
				value : 'Y'
			}, {
				regex : '/widgets/',
				value : 'Y'
			}, {
				regex : '/cdctv/',
				value : 'Y'
			}, {
				regex : 'www2c.cdc.gov/podcasts/',
				value : 'Y'
			}, {
				regex : 'www2c.cdc.gov/ecards/',
				value : 'Y'
			}, {
				regex : 'phil.cdc.gov/phil/',
				value : 'Y'
			}, {
				regex : '/24-7/',
				value : 'Y'
			}, {
				regex : '/cdc-info/',
				value : 'Y'
			}, {
				regex : '/publications/panflu/',
				value : 'Y'
			}, {
				regex : '/ACA/',
				value : 'Y'
			}, {
				regex : '/ccindex/',
				value : 'Y'
			}]
		},
		Flu : {
			source : 'url',
			patterns : [{
				regex : '/flu/',
				value : 'Y'
			}]
		},
		NCHHSTP : {
			source : 'url',
			patterns : [{
				regex : '/actagainstaids/',
				value : 'Y'
			}, {
				regex : '/tuskegee/',
				value : 'Y'
			}, {
				regex : '/condomeffectiveness/',
				value : 'Y'
			}, {
				regex : '/correctionalhealth/',
				value : 'Y'
			}, {
				regex : '/msmhealth/',
				value : 'Y'
			}, {
				regex : '/lgbthealth/',
				value : 'Y'
			}, {
				regex : '/pwud/',
				value : 'Y'
			}, {
				regex : '/sexualhealth/',
				value : 'Y'
			}, {
				regex : '/oid/',
				value : 'Y'
			}, {
				regex : '/nchhstp/',
				value : 'Y'
			}, {
				regex : '/healthyyouth/',
				value : 'Y'
			}, {
				regex : '/tb/',
				value : 'Y'
			}, {
				regex : '/std/',
				value : 'Y'
			}, {
				regex : '/hiv/',
				value : 'Y'
			}, {
				regex : '/hepatitis/',
				value : 'Y'
			}, {
				regex : '/gshs/',
				value : 'Y'
			}, {
				regex : '/KnowHepatitisB/',
				value : 'Y'
			}, {
				regex : '/knowmorehepatitis/',
				value : 'Y'
			}, {
				regex : '/stdconference/',
				value : 'Y'
			}, {
				regex : '/trendstatement',
				value : 'Y'
			}]
		},
		Injury : {
			source : 'url',
			patterns : [{
				regex : '/injury/',
				value : 'Y'
			}, {
				regex : '/ace/',
				value : 'Y'
			}, {
				regex : '/HomeandRecreationalSafety/',
				value : 'Y'
			}, {
				regex : '/SafeChild/',
				value : 'Y'
			}, {
				regex : '/MotorVehicleSafety/',
				value : 'Y'
			}, {
				regex : '/ParentsAretheKey/',
				value : 'Y'
			}, {
				regex : '/ViolencePrevention/',
				value : 'Y'
			}, {
				regex : '/TraumaticBrainInjury/',
				value : 'Y'
			}, {
				regex : '/Concussion/',
				value : 'Y'
			}, {
				regex : '/steadi/',
				value : 'Y'
			}, {
				regex : '/drugoverdose/',
				value : 'Y'
			}]
		},
		EPR : {
			source : 'url',
			patterns : [{
				regex : 'emergency.cdc.gov',
				value : 'Y'
			}]
		},
		CommunityGuide : {
			source : 'url',
			patterns : [{
				regex : 'thecommunityguide.org',
				value : 'Y'
			}]
		},
		Chronic : {
			source : 'url',
			patterns : [{
				regex : '/bam/',
				value : 'Y'
			}, {
				regex : '/nccdphp/dph/',
				value : 'Y'
			}, {
				regex : '/nccdphp/dch/',
				value : 'Y'
			}, {
				regex : '/makinghealtheasier/',
				value : 'Y'
			}, {
				regex : '/nationalhealthyworksite/',
				value : 'Y'
			}, {
				regex : '/coordinatedchronic/',
				value : 'Y'
			}, {
				regex : '/aging/',
				value : 'Y'
			}, {
				regex : '/alcohol/',
				value : 'Y'
			}, {
				regex : '/arthritis/',
				value : 'Y'
			}, {
				regex : '/copd/',
				value : 'Y'
			}, {
				regex : '/epilepsy/',
				value : 'Y'
			}, {
				regex : '/hrqol/',
				value : 'Y'
			}, {
				regex : '/ibd/',
				value : 'Y'
			}, {
				regex : '/ic/',
				value : 'Y'
			}, {
				regex : '/prc/',
				value : 'Y'
			}, {
				regex : '/sleep/',
				value : 'Y'
			}, {
				regex : '/cancer/',
				value : 'Y'
			}, {
				regex : '/spanish/cancer/',
				value : 'Y'
			}, {
				regex : '/diabetes/',
				value : 'Y'
			}, {
				regex : '/visionhealth/',
				value : 'Y'
			}, {
				regex : '/cholesterol',
				value : 'Y'
			}, {
				regex : '/dhdsp/',
				value : 'Y'
			}, {
				regex : '/heartdisease/',
				value : 'Y'
			}, {
				regex : '/bloodpressure/',
				value : 'Y'
			}, {
				regex : '/salt/',
				value : 'Y'
			}, {
				regex : '/stroke/',
				value : 'Y'
			}, {
				regex : '/wisewoman/',
				value : 'Y'
			}, {
				regex : '/breastfeeding/',
				value : 'Y'
			}, {
				regex : '/nccdphp/dnpao/',
				value : 'Y'
			}, {
				regex : '/obesity/',
				value : 'Y'
			}, {
				regex : '/physicalactivity/',
				value : 'Y'
			}, {
				regex : '/healthyweight/',
				value : 'Y'
			}, {
				regex : '/nutrition/',
				value : 'Y'
			}, {
				regex : '/nccdphp/dnpao/growthcharts/',
				value : 'Y'
			}, {
				regex : '/immpact/',
				value : 'Y'
			}, {
				regex : '/fluoridation/',
				value : 'Y'
			}, {
				regex : '/oralhealth/',
				value : 'Y'
			}, {
				regex : '/reproductivehealth/',
				value : 'Y'
			}, {
				regex : '/art/',
				value : 'Y'
			}, {
				regex : '/prams',
				value : 'Y'
			}, {
				regex : '/sids/',
				value : 'Y'
			}, {
				regex : '/teenpregnancy/',
				value : 'Y'
			}, {
				regex : '/chronicdisease/',
				value : 'Y'
			}, {
				regex : '/workplacehealthpromotion/',
				value : 'Y'
			}, {
				regex : '/pcd/',
				value : 'Y'
			}, {
				regex : '/tobacco/',
				value : 'Y'
			}, {
				regex : '/psoriasis/',
				value : 'Y'
			}, {
				regex : '/brfss/',
				value : 'Y'
			}, {
				regex : '/cdmis/',
				value : 'Y'
			}, {
				regex : '500Cities',
				value : 'Y'
			}, {
				regex : 'aging/agingdata/',
				value : 'Y'
			}, {
				regex : 'ART',
				value : 'Y'
			}, {
				regex : 'bam',
				value : 'Y'
			}, {
				regex : 'brfss/brfssprevalence/',
				value : 'Y'
			}, {
				regex : 'cdi/',
				value : 'Y'
			}, {
				regex : 'fluoridation',
				value : 'Y'
			}, {
				regex : 'gis',
				value : 'Y'
			}, {
				regex : 'healthcommworks',
				value : 'Y'
			}, {
				regex : 'healthyschools',
				value : 'Y'
			}, {
				regex : 'healthyweight',
				value : 'Y'
			}, {
				regex : 'heartdisease',
				value : 'Y'
			}, {
				regex : 'hrqol',
				value : 'Y'
			}, {
				regex : 'learnmorefeelbetter',
				value : 'Y'
			}, {
				regex : 'lupus',
				value : 'Y'
			}, {
				regex : 'oralhealthdata',
				value : 'Y'
			}, {
				regex : 'oshdata',
				value : 'Y'
			}, {
				regex : 'prams/pramstat/',
				value : 'Y'
			}, {
				regex : 's.hhs.gov',
				value : 'Y'
			}, {
				regex : 'statesystem/',
				value : 'Y'
			}, {
				regex : 'tobacco/campaign/tips/',
				value : 'Y'
			}, {
				regex : 'visionhealth/visionhealthdata/',
				value : 'Y'
			}]
		},
		NCIRD : {
			source : 'url',
			patterns : [{
				regex : '/ncird/',
				value : 'Y'
			}, {
				regex : '/vaccines/',
				value : 'Y'
			}, {
				regex : '/abcs/',
				value : 'Y'
			}, {
				regex : '/norovirus/',
				value : 'Y'
			}, {
				regex : '/measles/',
				value : 'Y'
			}, {
				regex : '/rotavirus/',
				value : 'Y'
			}, {
				regex : '/mumps/',
				value : 'Y'
			}, {
				regex : '/rubella/',
				value : 'Y'
			}, {
				regex : '/herpesbvirus/',
				value : 'Y'
			}, {
				regex : '/pertussis/',
				value : 'Y'
			}, {
				regex : '/rsv/',
				value : 'Y'
			}, {
				regex : '/meningitis/',
				value : 'Y'
			}, {
				regex : '/legionella/',
				value : 'Y'
			}, {
				regex : '/groupbstrep/',
				value : 'Y'
			}, {
				regex : '/groupastrep/',
				value : 'Y'
			}, {
				regex : '/conjunctivitis/',
				value : 'Y'
			}, {
				regex : '/cmv/',
				value : 'Y'
			}, {
				regex : '/pneumonia/',
				value : 'Y'
			}, {
				regex : '/streplab/',
				value : 'Y'
			}, {
				regex : '/hpv/',
				value : 'Y'
			}, {
				regex : '/surveillance/nrevss/',
				value : 'Y'
			}, {
				regex : '/epstein-barr/',
				value : 'Y'
			}, {
				regex : '/urdo/',
				value : 'Y'
			}, {
				regex : '/Adenovirus/',
				value : 'Y'
			}, {
				regex : '/Chickenpox/',
				value : 'Y'
			}, {
				regex : '/Hand-foot-mouth/',
				value : 'Y'
			}, {
				regex : '/parvovirusB19/',
				value : 'Y'
			}, {
				regex : '/SARS/',
				value : 'Y'
			}, {
				regex : '/Shingles/',
				value : 'Y'
			}, {
				regex : '/coronavirus/',
				value : 'Y'
			}, {
				regex : '/hi-disease/',
				value : 'Y'
			}, {
				regex : '/parainfluenza/',
				value : 'Y'
			}, {
				regex : '/meningococcal/',
				value : 'Y'
			}, {
				regex : '/ncird/software/elisa/',
				value : 'Y'
			}, {
				regex : '/diphtheria/',
				value : 'Y'
			}, {
				regex : '/pneumococcal/',
				value : 'Y'
			}, {
				regex : '/tetanus/',
				value : 'Y'
			}, {
				regex : '/surveillance/nvsn/',
				value : 'Y'
			}, {
				regex : '/abcs/',
				value : 'Y'
			}, {
				regex : 'polio/us',
				value : 'Y'
			}, {
				regex : '/pneumonia/atypical/cpneumoniae/',
				value : 'Y'
			}, {
				regex : '/pneumonia/atypical/mycoplasma/',
				value : 'Y'
			}, {
				regex : '/coronavirus/mers/',
				value : 'Y'
			}, {
				regex : '/vaccines/parents/',
				value : 'Y'
			}, {
				regex : '/vaccines/adults/',
				value : 'Y'
			}, {
				regex : '/vaccines/pregnancy/',
				value : 'Y'
			}]
		},
		NCEZID : {
			source : 'url',
			patterns : [{
				regex : 'wwwnc.cdc.gov/travel',
				value : 'Y'
			}, {
				regex : 'wwwnc.cdc.gov/eid',
				value : 'Y'
			}, {
				regex : '/lyme/',
				value : 'Y'
			}, {
				regex : '/ncidod/dvbid/westnile/',
				value : 'Y'
			}, {
				regex : '/fungal/',
				value : 'Y'
			}, {
				regex : '/rabies/',
				value : 'Y'
			}, {
				regex : '/salmonella/',
				value : 'Y'
			}, {
				regex : '/hantavirus/',
				value : 'Y'
			}, {
				regex : '/nhsn/',
				value : 'Y'
			}, {
				regex : '/ncezid/',
				value : 'Y'
			}, {
				regex : '/healthywater/',
				value : 'Y'
			}, {
				regex : '/hicpac/',
				value : 'Y'
			}, {
				regex : '/vaccinesafety/',
				value : 'Y'
			}, {
				regex : '/dengue/',
				value : 'Y'
			}, {
				regex : '/ecoli/',
				value : 'Y'
			}, {
				regex : '/cfs/',
				value : 'Y'
			}, {
				regex : '/healthypets/',
				value : 'Y'
			}, {
				regex : '/ticks/',
				value : 'Y'
			}, {
				regex : '/foodsafety/',
				value : 'Y'
			}, {
				regex : '/listeria/',
				value : 'Y'
			}, {
				regex : '/ncidod/dvrd/molluscum/',
				value : 'Y'
			}, {
				regex : '/ncidod/dvrd/orf_virus/',
				value : 'Y'
			}, {
				regex : '/cholera/',
				value : 'Y'
			}, {
				regex : '/rodents/',
				value : 'Y'
			}, {
				regex : '/handwashing/',
				value : 'Y'
			}, {
				regex : '/immigrantrefugeehealth/',
				value : 'Y'
			}, {
				regex : '/yellowfever/',
				value : 'Y'
			}, {
				regex : '/leptospirosis/',
				value : 'Y'
			}, {
				regex : '/ncidod/dvrd/spb/',
				value : 'Y'
			}, {
				regex : '/animalimportation/',
				value : 'Y'
			}, {
				regex : '/foodborneburden/',
				value : 'Y'
			}, {
				regex : '/oubreaknet/',
				value : 'Y'
			}, {
				regex : '/plague/',
				value : 'Y'
			}, {
				regex : '/rmsf/',
				value : 'Y'
			}, {
				regex : '/tularemia/',
				value : 'Y'
			}, {
				regex : '/prions/',
				value : 'Y'
			}, {
				regex : '/dialysissafety/',
				value : 'Y'
			}, {
				regex : '/ncidod/dvrd/bse/',
				value : 'Y'
			}, {
				regex : '/qfever/',
				value : 'Y'
			}, {
				regex : '/japaneseencephalitis/',
				value : 'Y'
			}, {
				regex : '/foodnet/',
				value : 'Y'
			}, {
				regex : '/medicationsafety/',
				value : 'Y'
			}, {
				regex : '/anaplasmosis/',
				value : 'Y'
			}, {
				regex : '/ehrlichiosis/',
				value : 'Y'
			}, {
				regex : '/hai/',
				value : 'Y'
			}, {
				regex : '/handhygiene/',
				value : 'Y'
			}, {
				regex : '/mrsa/',
				value : 'Y'
			}, {
				regex : '/injectionsafety/',
				value : 'Y'
			}, {
				regex : '/sharpsafety/',
				value : 'Y'
			}]
		},
		OSTLTS : {
			source : 'url',
			patterns : [{
				regex : '/phlp/',
				value : 'Y'
			}, {
				regex : '/stltpublichealth/',
				value : 'Y'
			}, {
				regex : '/phap/',
				value : 'Y'
			}, {
				regex : '/tribal/',
				value : 'Y'
			}, {
				regex : '/psr/',
				value : 'Y'
			}, {
				regex : '/phhsblockgrant/',
				value : 'Y'
			}]
		},
		GlobalHealth : {
			source : 'url',
			patterns : [{
				regex : '/globalhealth/',
				value : 'Y'
			}, {
				regex : '/globalaids/',
				value : 'Y'
			}, {
				regex : '/malaria/',
				value : 'Y'
			}, {
				regex : '/parasites/',
				value : 'Y'
			}, {
				regex : '/haiticholera/',
				value : 'Y'
			}, {
				regex : '/polio/',
				value : 'Y'
			}, {
				regex : '/dpdx/',
				value : 'Y'
			}]
		},
		ATSDR : {
			source : 'url',
			patterns : [{
				regex : 'cdc.gov/als/',
				value : 'Y'
			}, {
				regex : 'gis.cdc.gov/grasp/webmaps/main.html',
				value : 'Y'
			}, {
				regex : 'atsdr.cdc.gov',
				value : 'Y'
			}]
		},
		NCEH : {
			source : 'url',
			patterns : [{
				regex : 'ephtracking.cdc.gov/',
				value : 'Y'
			}, {
				regex : '/nceh/',
				value : 'Y'
			}, {
				regex : '/nutritionreport/',
				value : 'Y'
			}, {
				regex : '/asthma/',
				value : 'Y'
			}, {
				regex : '/biomonitoring/',
				value : 'Y'
			}, {
				regex : '/climateandhealth/',
				value : 'Y'
			}, {
				regex : '/co/',
				value : 'Y'
			}, {
				regex : '/exposurereport/',
				value : 'Y'
			}, {
				regex : '/healthyhomes/',
				value : 'Y'
			}, {
				regex : '/healthyplaces/',
				value : 'Y'
			}, {
				regex : '/labstandards/',
				value : 'Y'
			}, {
				regex : '/mold/',
				value : 'Y'
			}, {
				regex : '/nbslabbulletin/',
				value : 'Y'
			}, {
				regex : '/air/',
				value : 'Y'
			}, {
				regex : '/transportation/',
				value : 'Y'
			}, {
				regex : '/extremeheat/',
				value : 'Y'
			}, {
				regex : 'blogs.cdc.gov/yourhealthyourenvironment/',
				value : 'Y'
			}]
		},
		Spanish : {
			source : 'url',
			patterns : [{
				regex : '/spanish/',
				value : 'Y'
			}]
		},
		MMWR : {
			source : 'url',
			patterns : [{
				regex : '/mmwr/',
				value : 'Y'
			}]
		},
		BirthDefects : {
			source : 'url',
			patterns : [{
				regex : '/ncbddd/',
				value : 'Y'
			}, {
				regex : '/parents/',
				value : 'Y'
			}, {
				regex : '/preconception/',
				value : 'Y'
			}, {
				regex : '/pregnancy/',
				value : 'Y'
			}, {
				regex : '/childpreventiveservices/',
				value : 'Y'
			}, {
				regex : '/childrensmentalhealth',
				value : 'Y'
			}]
		},
		NIOSH : {
			source : 'url',
			patterns : [{
				regex : '/niosh/',
				value : 'Y'
			}]
		},
		OPHPR : {
			source : 'url',
			patterns : [{
				regex : '/phpr/',
				value : 'Y'
			}]
		},
		OCOO : {
			source : 'url',
			patterns : [{
				regex : '/employment/',
				value : 'Y'
			}, {
				regex : '/about/ethics/',
				value : 'Y'
			}, {
				regex : '/fmo',
				value : 'Y'
			}, {
				regex : '/od/ocio/',
				value : 'Y'
			}, {
				regex : '/od/pgo/funding/grants/',
				value : 'Y'
			}, {
				regex : '/od/pgo/funding/contracts/',
				value : 'Y'
			}, {
				regex : '/biosafety/',
				value : 'Y'
			}, {
				regex : '/maso/',
				value : 'Y'
			}, {
				regex : '/maso/facm/',
				value : 'Y'
			}, {
				regex : '/od/foia',
				value : 'Y'
			}, {
				regex : '/sustainability',
				value : 'Y'
			}, {
				regex : 'www2a.cdc.gov/od/foiastatus/',
				value : 'Y'
			}, {
				regex : '/jobs/',
				value : 'Y'
			}]
		},
		MISO : {
			source : 'url',
			patterns : [{
				regex : '/policy/',
				value : 'Y'
			}, {
				regex : '/washington/',
				value : 'Y'
			}, {
				regex : '/biosafety/',
				value : 'Y'
			}, {
				regex : '/diversity/',
				value : 'Y'
			}, {
				regex : '/od/eaipp/',
				value : 'Y'
			}, {
				regex : '/eval/',
				value : 'Y'
			}, {
				regex : '/family/',
				value : 'Y'
			}, {
				regex : '/od/foia',
				value : 'Y'
			}, {
				regex : '/evaluation/',
				value : 'Y'
			}, {
				regex : '/men/',
				value : 'Y'
			}, {
				regex : '/program/',
				value : 'Y'
			}, {
				regex : '/od/science',
				value : 'Y'
			}, {
				regex : '/od/ocio/',
				value : 'Y'
			}, {
				regex : '/sustainability',
				value : 'Y'
			}, {
				regex : '/women/',
				value : 'Y'
			}, {
				regex : 'www2a.cdc.gov/od/foiastatus/',
				value : 'Y'
			}, {
				regex : '/mentalhealth/',
				value : 'Y'
			}]
		},
		Jobs : {
			source : 'url',
			patterns : [{
				regex : 'jobs.cdc.gov',
				value : 'Y'
			}, {
				regex : 'cdc.gov/jobs',
				value : 'Y'
			}]
		},
		Zika : {
			source : 'url',
			patterns : [{
				regex : 'cdc.gov/zika',
				value : 'Y'
			}]
		}
	},

	mode : 'first-party'
};


    if(supports_amd)
        define(function(){ return FSR; })
})();
