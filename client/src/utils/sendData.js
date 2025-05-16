export const createUser=async(name,dob,nationality,passport_no,passportScan,email,password,IdScan,cnic)=>{
    try {
        
        const [fname, ...rest] = name.trim().split(" ")
        const lname=rest.join(" ");
        if(!fname ||!lname ||!dob ||!nationality ||!passport_no ||!passportScan ||!email|| !password){
            console.log(fname,lname,name,dob,nationality,passport_no,passportScan,email,password)
            return {message:"Enter all the required fields"}
        }
        const formData = new FormData();
        formData.append("fname", fname);
        formData.append("lname", lname);
        formData.append("dob", dob);
        formData.append("nationality", nationality);
        formData.append("passport_no", passport_no);
        formData.append("passportScan", passportScan);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("cnicImg",IdScan);
        formData.append("cnicNo",cnic)

        const response = await fetch("http://localhost:5000/api/users/signup", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Failed to submit user info");
        }
        const reply = await response.json();
        console.log(reply);
        if (reply.message) {
            return { message: reply.message };
        }
        localStorage.setItem("authtoken", reply.token);
        return reply.user;
    } catch (err) {
        console.log(err);
        return { message: "An error occurred"};
    }
};

export const updateUser=async(formData)=>{
    try{
        const token=localStorage.getItem("authtoken")
        if(!formData.displayName||!formData.email||!formData.nationality || !formData.passportNumber || !formData.dateOfBirth){
            return {message:"Enter the required vals"}
        } 
        if(formData.displayName.trim().split(" ").length<2){
            return {message:"enter full name"}
        }
        const [fname, ...rest] = formData.displayName.trim().split(" ")
        const lname=rest.join(" ");
        const response = await fetch('http://localhost:5000/api/users/acc/update', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json','Authorization': `Bearer ${token.trim().replace(/^"|"$/g, "")}`
            },
            body: JSON.stringify({
              fname,lname,nationality:formData.nationality,passport_no:formData.passportNumber,email:formData.email,cnic:formData.idNumber,phoneNo:formData.phoneNumber,DOB:formData.dateOfBirth?.slice(0,10)
            }),
          });
      
          if (!response.ok) {
            throw new Error('Failed to update profile');
          }
      
          const reply = await response.json(); // Assuming backend sends back the updated user info
          if(reply.message){
            return {message:reply.message}
          }
          const newtoken=reply.token
          localStorage.setItem('authtoken',newtoken);
          return reply.user
    }catch(err){
        console.log(err)
        return {message:"Something went wrong please try later"}
    }
}

export const updateImg=async(imgtype,file)=>{
        const formData = new FormData();
        formData.append("image", file); // the file
        formData.append("type", imgtype); // tells backend what image it is
        const token=localStorage.getItem("authtoken");
        const response = await fetch('http://localhost:5000/api/users/acc/update/imgs', {
            method: "PUT",
            headers: {
              'Authorization': `Bearer ${token.trim().replace(/^"|"$/g, "")}`
            },
            body: formData,
          });
      
          if (!response.ok) {
            throw new Error(reply.message || "Failed to upload image");
        }
      
        const reply = await response.json(); // Assuming backend sends back the updated user info
        return reply
    }