const clientdb = [
    {
        id: 100,
        lookup: 'GRIFJE001',
        account_name: 'Jeremy Kyle Griffin',
        dba:         '',
        first_name:   'Kyle',
        last_name:    'Griffin',
        contact_email:   'kylegriffin@proassurance.com',
        contact_phone:   '(205) 877-4495',
        account_manager: 'Kyle Griffin',
        account_manager_title: 'Operations Specialist',
        account_manager_email: 'kylegriffin@proassurance.com',
        account_manager_profile_photo: 'https://media.licdn.com/dms/image/v2/D5603AQE86tEFgtyJJg/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1688610337842?e=2147483647&v=beta&t=AgSTIJs_lajv5vZabTWdDu-eSgeRWBBTTeMy_LpIaMI',
        producer: 'Lisa Montgolf',
        producer_email: 'lisamontgolf@proassurance.com',
        producer_title: "Director - Agency Operations",
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
                policy_number: '999426301',
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
        lookup: 'MONTLISA-1',
        account_name: "Lisa Montgolf",
        dba: '',
        first_name:   'Lisa',
        last_name:    'Montgolf',
        contact_email:   'lisamontgolf@proassurance.com',
        contact_phone:   '(205) 445-2661',
        account_manager: 'Karen Lansdell',
        account_manager_title: "Account Executive I",
        account_manager_email: 'karenlansdell@proassurance.com',
        producer: 'Lisa Montgolf',
        producer_email: 'lisamontgolf@proassurance.com',
        producer_title: "Director - Agency Operations",
        producer_profile_photo: 'https://508142.fs1.hubspotusercontent-na1.net/hub/508142/hubfs/ProAssurance%202024%20-%20Main%20Site/Headshots/LisaMontgolf.jpg?width=300&name=LisaMontgolf.jpg',
        billing_address: {
            bill_to: "Lisa Montgolf",
            contact_name: "Lisa Montgolf",
            email: "lisamontgolf@proassurance.com",
            phone: "205-445-2661",
            street1: "C/O ProAssurance Agency, PO Box 590009",
            city: "Brimingham",
            state: "AL",
            zip: "35259-0009"
        },
        business_address: {
            street1: "C/O ProAssurance Agency, PO Box 590009",
            city: "Brimingham",
            state: "AL",
            zip: "35259-0009",
            same_as_mailing: false
        },
        occupation: '',
        specialty: '',
        npi: '',
        tax_id: '',
        license_number: '',
        years_in_practice:'',
        agent_notes: '',
        policies: [
            {
                id:200,
                type: "SBND",
                type_description: "Surety Bond - CA Surplus Lines",
                policy_number: '999448744',
                carrier: 'Ohio Casualty Insurance Co',
                premium_payable: 'Liberty Mutual Surety',
                effective_date: '12/01/2025',
                expiration_date: '12/01/2026',
                premium: 500,
                status: "New Business",
            },
            {
                id:201,
                type: "SBND",
                type_description: "Surety Bond - AL Surplus",
                policy_number: '3305500',
                carrier: 'Ohio Casualty Insurance Co',
                premium_payable: 'Liberty Mutual Surety',
                effective_date: '10/01/2025',
                expiration_date: '10/01/2026',
                premium: 500,
                status: "Renewal",
            },
            {
                id:202,
                type: "INLM",
                type_description: "Inland Marine Policy",
                policy_number: '9340004727007',
                carrier: 'The Phoenix Insurance Company',
                premium_payable: 'The Travelers',
                effective_date: '11/07/2025',
                expiration_date: '11/07/2026',
                premium: 460,
                status: "Renewal",
            },
            {
                id:203,
                type: "NBND",
                type_description: "Notary Bond",
                policy_number: '99421849',
                carrier: 'Ohio Casualty Insurance Co',
                premium_payable: 'Liberty Mutual Surety',
                effective_date: '07/25/2025',
                expiration_date: '07/25/2026',
                premium: 100,
                status: "Renewal",
            }

        ]
    },
    {
        id: 102,
        lookup: 'CRIMCH0001',
        account_name: "Christina Crim",
        dba: '',
        first_name:   'Christina',
        last_name:    'Crim',
        contact_email:   'christinacrim@proassurance.com',
        contact_phone:   '',
        account_manager: 'Karen Lansdell',
        account_manager_title: "Account Executive I",
        account_manager_email: 'karenlansdell@proassurance.com',
        producer: 'Keaton Jones',
        producer_email: 'keatonjones@proassurance.com',
        producer_title: "Senior Account Executive",
        producer_profile_photo: 'https://508142.fs1.hubspotusercontent-na1.net/hub/508142/hubfs/ProAssurance%202024%20-%20Main%20Site/Headshots/KeatonJones.jpg?width=300&name=KeatonJones.jpg',
        billing_address: {
            bill_to: "Christina Crim",
            contact_name: "Christina Crim",
            email: "christinacrim@proassurance.com",
            phone: "",
            street1: "C/O PRA Agency, 100 Brookwood Place",
            city: "Brimingham",
            state: "AL",
            zip: "35209"
        },
        business_address: {
            street1: "C/O PRA Agency, 100 Brookwood Place",
            city: "Brimingham",
            state: "AL",
            zip: "35209",
            same_as_mailing: false
        },
        occupation: '',
        specialty: '',
        npi: '',
        tax_id: '',
        license_number: '',
        years_in_practice:'',
        agent_notes: '',
        policies: [
            {
                id:300,
                type: "SBND",
                type_description: "Surety Bond",
                policy_number: '016237701',
                carrier: 'Ohio Casualty Insurance Co',
                premium_payable: 'Liberty Mutual Surety',
                effective_date: '08/15/2025',
                expiration_date: '08/15/2026',
                premium: 500,
                status: "Renewal",
            }

        ]
    }
]

const links = [
    {
        id: 'ABC-XYZ',
        reference: 'client/100'
    },
    {
        id: 'AQW-DER',
        reference: 'client/101'
    },
    {
        id: 'DFT-FTG',
        reference: 'client/102'
    }
]

module.exports = {clientdb, links};