export default {
    "scalars": [
        0,
        2,
        4,
        8
    ],
    "types": {
        "Date": {},
        "Mutation": {
            "addOrdonnance": [
                3,
                {
                    "patientID": [
                        2,
                        "String!"
                    ],
                    "text": [
                        2,
                        "String!"
                    ]
                }
            ],
            "addRdv": [
                7,
                {
                    "dateRdv": [
                        2,
                        "String!"
                    ],
                    "heureRdv": [
                        2,
                        "String!"
                    ],
                    "patientID": [
                        2,
                        "String!"
                    ]
                }
            ],
            "createPatient": [
                5,
                {
                    "dateNaissance": [
                        0,
                        "Date!"
                    ],
                    "email": [
                        2,
                        "String!"
                    ],
                    "nom": [
                        2,
                        "String!"
                    ],
                    "numeroSecu": [
                        2
                    ],
                    "prenom": [
                        2,
                        "String!"
                    ],
                    "telephone": [
                        2,
                        "String!"
                    ]
                }
            ],
            "updateDateRdv": [
                7,
                {
                    "newDate": [
                        2,
                        "String!"
                    ],
                    "rdvID": [
                        2,
                        "String!"
                    ]
                }
            ],
            "updateHourRdv": [
                7,
                {
                    "newHour": [
                        2,
                        "String!"
                    ],
                    "rdvID": [
                        2,
                        "String!"
                    ]
                }
            ],
            "__typename": [
                2
            ]
        },
        "String": {},
        "Ordonnance": {
            "id": [
                4
            ],
            "text": [
                2
            ],
            "__typename": [
                2
            ]
        },
        "ID": {},
        "Patient": {
            "dateNaissance": [
                0
            ],
            "email": [
                2
            ],
            "id": [
                4
            ],
            "nom": [
                2
            ],
            "numeroSecu": [
                2
            ],
            "ordonnances": [
                3
            ],
            "prenom": [
                2
            ],
            "rendezVous": [
                7
            ],
            "telephone": [
                2
            ],
            "__typename": [
                2
            ]
        },
        "Query": {
            "patient": [
                5,
                {
                    "patientID": [
                        2,
                        "String!"
                    ]
                }
            ],
            "patients": [
                5
            ],
            "__typename": [
                2
            ]
        },
        "RendezVous": {
            "dateRdv": [
                2
            ],
            "heureRdv": [
                2
            ],
            "id": [
                4
            ],
            "__typename": [
                2
            ]
        },
        "Boolean": {}
    }
}