const structure = {
  users: {
    //userUUid
    'bc584677-ab96-43ff-b759-3d6269399d02': {
      groups: {
        MOuL1sdbrnh0x1zGuXn7: true,
        //if deactivated, set to false
        FAuL1sdKrnh0x1zGuXn8: false,
      },
    },
  },

  tasks: {
    '107002f8-521d-4484-bb48-d412a2f3d222': {
      boss: '321fdw37-ab96-43ff-b759-3d1239399d03',
      heros: {
        'bc584677-ab96-43ff-b759-3d6269399d02': {
          group: 'MOuL1sdbrnh0x1zGuXn7',
        },
        '793b2800-e8f4-4dae-8701-c11d7dcd7cf8': {
          group: 'MOuL1sdbrnh0x1zGuXn7',
        },
      },
    },
  },

  groups: {
    //group id
    MOuL1sdbrnh0x1zGuXn7: {
      //taskUuid
      task: '107002f8-521d-4484-bb48-d412a2f3d222',
      active: false,
      boss: {
        id: '321fdw37-ab96-43ff-b759-3d1239399d03',
        name: 'boss-1441',
        role: 'boss',
      },
      hero: {
        id: 'bc584677-ab96-43ff-b759-3d6269399d02',
        name: 'hero-1231',
        role: 'hero',
      },
      lastMessage: {
        user: '00000000-0000-0000-0000-000000000000',
        role: 'admin',
        name: 'hero-1231',
        type: 'image',
        content: '107002f8-521d-4484-bb48-d412a2f3d222',
        timestamp: 1412311875391,
      },
    },
  },

  messages: {
    //groupId
    MOuL1sdbrnh0x1zGuXn7: {
      //messageId
      '3a6Fo5rrUcBqhUJcLsP0': {
        user: 'bc584677-ab96-43ff-b759-3d6269399d02',
        role: 'hero',
        name: 'hero-1231',
        type: 'text',
        content: 'The relay seems to be malfunctioning.',
        timestamp: 1459361875337,
      },
      '4LXlVnWnoqyZEuKiiubh': {
        user: '00000000-0000-0000-0000-000000000000',
        role: 'admin',
        name: 'hero-1231',
        type: 'image',
        content: '107002f8-521d-4484-bb48-d412a2f3d222',
        timestamp: 1412311875391,
      },
    },
  },
};

const rules = {
  rules: {
    users: {
      $uid: {
        // Allow only authenticated content owners access to their data
        '.read':
          "(auth != null && auth.uid == $uid) || auth.uid == '00000000-0000-0000-0000-000000000000'",
        '.write': false,
      },
    },
    tasks: {
      '.read': "auth.uid == '00000000-0000-0000-0000-000000000000'",
      '.write': false,
    },
    groups: {
      $groupid: {
        '.read':
          "root.child('users').child(auth.uid).child('groups').child($groupid).val() != null || auth.uid == '00000000-0000-0000-0000-000000000000'",
        '.write': false,
      },
    },
    messages: {
      $groupid: {
        '.read':
          "root.child('users').child(auth.uid).child('groups').child($groupid).val() != null || auth.uid == '00000000-0000-0000-0000-000000000000'",
        '.write': false,
      },
    },
    // ".read": "now < 1745372800000",  // 2022-2-21
    // ".write": "now < 1745372800000",  // 2022-2-21
  },
};
