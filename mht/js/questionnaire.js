var questionnaire = {
	"patientID": "email@address.com",
	"sessionID": "0123456789",
	"randomize": 0,
	"flip": 1,
	"questions": [
		{
			"questionID": "vas_0",
			"stem": "your current mood:",
			"anchors": [
				"Worst ever",
				"Best ever"
			],
			"flipped": 0
		},
		{
			"questionID": "vas_1",
			"stem": "your current level of depression / sadness:",
			"anchors": [
				"Extremely depressed / sad",
				"Not depressed / not sad"
			],
			"flipped": 0
		},
		{
			"questionID": "mc_0",
			"days": 14,
			"stem": "have you been feeling sad or depressed?",
			"anchors": [
				"No, not at all.",
				"Yes, a little bit.",
				"Yes, I have felt sad or depressed most of the time.",
				"Yes, I have been very sad or depressed nearly all the time.",
				"Yes, I have been extremely depressed nearly all the time."
			]
		},
		{
			"questionID": "mc_1",
			"days": 2,
			"stem": "which of the following best describes your level of interest in your usual activities during the past day?",
			"anchors": [
				"I have not lost interest in my usual activities.",
				"I have been less interested in 1 or 2 of my usual activities.",
				"I have been less interested in several of my usual activities.",
				"I have lost most of my interest in almost all of my usual activities.",
				"I have lost all interest in all of my usual activities."
			]
		},
		{
			"questionID": "mc_15",
			"stem": "…have you been admitted to a hospital",
			"days": 14,
			"anchors": [
				"No",
				"Yes"
			]
		},
		{
			"questionID": "mc_16",
			"stem": "…have you visited the Emergency Room",
			"days": 1,
			"anchors": [
				"No",
				"Yes"
			]
		}
	]
};