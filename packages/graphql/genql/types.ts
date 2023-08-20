export default {
    "scalars": [
        1,
        3,
        6
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
            "createPatient": [
                4,
                {
                    "email": [
                        1,
                        "String!"
                    ],
                    "numeroSecu": [
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
            "email": [
                1
            ],
            "id": [
                3
            ],
            "numeroSecu": [
                1
            ],
            "ordonnances": [
                2
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
        "Boolean": {}
    }
}