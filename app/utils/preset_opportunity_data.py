"""
This file contains the preset opportunity data for different relationship types.
"""

FOUNDATIONAL_OPPORTUNITIES = [
    {
        'title': 'Endorse a skill or service',
        'description': 'Take a moment to endorse a skill or service this contact provides.',
        'occurrence': 'Once',
        'icon': '👍'
    },
    {
        'title': 'Networking Introduction',
        'description': 'Connect this contact with someone in your network who might be beneficial.',
        'occurrence': 'Bi-Annually',
        'icon': '🤝'
    },
    {
        'title': 'Followup Message / Checkin',
        'description': 'Send a short message to check in and maintain the relationship.',
        'occurrence': 'Bi-weekly',
        'icon': '💬'
    },
    {
        'title': 'Share Project Updates',
        'description': 'Share recent project updates or achievements with this contact.',
        'occurrence': 'Quarterly',
        'icon': '📊'
    }
]

# Relationship-specific opportunities
RELATION_OPPORTUNITIES = {
    'recruiter': [
        {
            'title': 'Express Interest in Future Work',
            'description': 'Check in about potential future opportunities and keep your name top of mind.',
            'occurrence': 'Bi-Annually',
            'icon': '💼'
        }
    ],
    'mentor': [
        {
            'title': 'Career Guidance Checkin',
            'description': 'Schedule time to discuss career goals and seek guidance.',
            'occurrence': 'Quarterly',
            'icon': '🧭'
        }
    ],
    'mentee': [
        {
            'title': 'Resource/Tool Recommendation',
            'description': 'Share a useful resource or tool that could help their development.',
            'occurrence': 'Monthly',
            'icon': '📚'
        }
    ],
    'peer': [
        {
            'title': 'Quick Coffee/Virtual Chat',
            'description': 'Schedule a casual catch-up over coffee or a virtual meeting.',
            'occurrence': 'Bi-Annually',
            'icon': '☕'
        }
    ]
}