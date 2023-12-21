    const emails = await Email.find({}, 'email');
    const emailList = emails.map(({ email }) => email);
    
    console.log(emailList);