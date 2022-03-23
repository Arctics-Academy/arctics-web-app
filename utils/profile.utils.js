const castToStudentListConsultant = function(consultant) {
    let studentListConsultant = {
        consultantId: consultant.id,
        photo: consultant.profile.photo,
        price: consultant.profile.price,
        school: consultant.profile.school,
        count: consultant.profile.count,
        labels: consultant.profile.labels,
        intro: consultant.profile.intro,
        star: consultant.profile.star
    };
    return studentListConsultant;
}


module.exports = 
{
    castToStudentListConsultant,
}