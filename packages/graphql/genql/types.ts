export default {
    "scalars": [
        1,
        3,
        7
    ],
    "types": {
        "Mutation": {
            "addOrdonnance": [
                2,
                {
                    "patientID": [
                        1,
                        "String!"
                    ],
                    "text": [
                        1,
                        "String!"
                    ]
                }
            ],
            "addRdv": [
                6,
                {
                    "dateRdv": [
                        1,
                        "String!"
                    ],
                    "heureRdv": [
                        1,
                        "String!"
                    ],
                    "patientID": [
                        1,
                        "String!"
                    ]
                }
            ],
            "createPatient": [
                4,
                {
                    "dateNaissance": [
                        1,
                        "String!"
                    ],
                    "email": [
                        1,
                        "String!"
                    ],
                    "nom": [
                        1,
                        "String!"
                    ],
                    "numeroSecu": [
                        1,
                        "String!"
                    ],
                    "prenom": [
                        1,
                        "String!"
                    ],
                    "telephone": [
                        1,
                        "String!"
                    ]
                }
            ],
            "updateDateRdv": [
                6,
                {
                    "newDate": [
                        1,
                        "String!"
                    ],
                    "rdvID": [
                        1,
                        "String!"
                    ]
                }
            ],
            "updateHourRdv": [
                6,
                {
                    "newHour": [
                        1,
                        "String!"
                    ],
                    "rdvID": [
                        1,
                        "String!"
                    ]
                }
            ],
            "__typename": [
                1
            ]
        },
        "String": {},
        "Ordonnance": {
            "id": [
                3
            ],
            "text": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "ID": {},
        "Patient": {
            "dateNaissance": [
                1
            ],
            "email": [
                1
            ],
            "id": [
                3
            ],
            "nom": [
                1
            ],
            "numeroSecu": [
                1
            ],
            "ordonnances": [
                2
            ],
            "prenom": [
                1
            ],
            "rendezVous": [
                6
            ],
            "telephone": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "Query": {
            "patient": [
                4,
                {
                    "patientID": [
                        1,
                        "String!"
                    ]
                }
            ],
            "patients": [
                4
            ],
            "__typename": [
                1
            ]
        },
        "RendezVous": {
            "dateRdv": [
                1
            ],
            "heureRdv": [
                1
            ],
            "id": [
                3
            ],
            "__typename": [
                1
            ]
        },
        "Boolean": {}
    }
}