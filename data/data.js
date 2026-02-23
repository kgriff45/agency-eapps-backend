const clientdb = [
    {
        id: 100,
        lookup: 'GRIFJE001',
        account_name: 'The Quack Shack',
        dba:         '',
        first_name:   'Kyle',
        last_name:    'Griffin',
        contact_email:   'kylegriffin45@outlook.com',
        contact_phone:   '(205) 877-4495',
        account_manager: 'Agency Employee',
        account_manager_email: 'kylegriffin@proassurance.com',
        //account_manager_profile_photo: 'https://508142.fs1.hubspotusercontent-na1.net/hub/508142/hubfs/ProAssurance%202024%20-%20Main%20Site/Headshots/KeatonJones.jpg?width=300&name=KeatonJones.jpg',
        producer: 'Agency Employee',
        producer_email: 'kylegriffin@proassurance.com',
        producer_title: "Senior Account Executive",
        producer_profile_photo: 'https://508142.fs1.hubspotusercontent-na1.net/hub/508142/hubfs/ProAssurance%202024%20-%20Main%20Site/Headshots/LisaMontgolf.jpg?width=300&name=LisaMontgolf.jpg',
        billing_address: {
            bill_to: "Kyle Griffin",
            contact_name: "Kyle Griffin",
            email: "kylegriffin@proassurance.com",
            phone: "205-877-4495",
            street1: "100 Brookwood Place",
            city: "Brimingham",
            state: "AL",
            zip: "35209"
        },
        business_address: {
            street1: "100 Brookwood Place",
            city: "Brimingham",
            state: "AL",
            zip: "35209",
            same_as_mailing: false
        },
        occupation:     'Physician — Internal Medicine',
        specialty:      'Internal Medicine',
        npi:            '',
        tax_id:          '',
        license_number:  '',
        years_in_practice:'5',
        agent_notes:     '',
        policies: [
            {
                id:100,
                type: "NBND",
                type_description: "Notary Bond",
                bond_number: '999426301',
                carrier: 'Ohio Casualty',
                premium_payable: 'Liberty Mutual',
                effective_date: '08/08/2025',
                expiration_date: '08/08/2029',
                premium: 1200,
                status: "New Business",
            },
            {
                id:108,
                type: "PCYB",
                type_description: "ProSecure Cyber Liability",
                policy_number: '999426301',
                carrier: 'Houston Casualty Co',
                premium_payable: 'Tokio Marine',
                effective_date: '09/18/2025',
                expiration_date: '09/18/2026',
                premium: 5600,
                status: "Renewal",
            }
        ]
    },
    {
        id: 101,
        lookup: 'ANNANNIE01',
        account_name: "Annie Anne, MD, PLLC",
        dba: 'Crossroads Medical Clinic',
        first_name:   'Annie',
        last_name:    'Anne',
        contact_email:   'kylegriffin45@outlook.com',
        contact_phone:   '(205) 877-4495',
        account_manager: 'Keaton Jones',
        account_manager_title: "Senior Account Executive",
        account_manager_email: 'kylegriffin@proassurance.com',
        account_manager_profile_photo: 'https://508142.fs1.hubspotusercontent-na1.net/hub/508142/hubfs/ProAssurance%202024%20-%20Main%20Site/Headshots/KeatonJones.jpg?width=300&name=KeatonJones.jpg',
        producer: 'Lisa Montgolf',
        producer_email: 'kylegriffin@proassurance.com',
        producer_title: "Director - Agency Operations",
        producer_profile_photo: 'https://508142.fs1.hubspotusercontent-na1.net/hub/508142/hubfs/ProAssurance%202024%20-%20Main%20Site/Headshots/LisaMontgolf.jpg?width=300&name=LisaMontgolf.jpg',
        billing_address: {
            bill_to: "Annie Anne, MD",
            contact_name: "Annie Anne",
            email: "kylegriffin@proassurance.com",
            phone: "205-877-4495",
            street1: "123 Maple Street",
            city: "Brimingham",
            state: "AL",
            zip: "35209"
        },
        business_address: {
            street1: "100 Brookwood Place",
            city: "Brimingham",
            state: "AL",
            zip: "35209",
            same_as_mailing: false
        },
        occupation: 'Physician — Internal Medicine',
        specialty: 'Internal Medicine',
        npi: '123456789',
        tax_id: '',
        license_number: '',
        years_in_practice:'15',
        agent_notes: '',
        policies: [
            {
                id:111,
                type: "PCYB",
                type_description: "ProSecure Cyber Liability",
                policy_number: 'H25PAS200018-25',
                carrier: 'Houston Casualty Company',
                premium_payable: 'Tokio Marine',
                effective_date: '08/08/2025',
                expiration_date: '08/08/2026',
                premium: 1225,
                status: "New Business",
            },
            {
                id:110,
                type: "MMPL",
                type_description: "Miscellanous Medical Professional Liability",
                policy_number: 'MM1245',
                carrier: 'ProAssurance Specialty Co,',
                premium_payable: 'ProAssurance Specialty Co.',
                effective_date: '09/18/2025',
                expiration_date: '09/18/2026',
                premium: 11695,
                status: "Renewal",
            }
        ]
    }
]

const links = [
    {
        id: 'abcxyz',
        reference: 'client/100'
    },
    {
        id: 'AQW-DER',
        reference: 'client/101'
    }
]

module.exports = {clientdb, links};