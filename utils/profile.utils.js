const castToStudentListConsultant = function(consultant) {
    let studentListConsultant = {
        consultantId: consultant.id,
        surname: consultant.profile.surname,
        name: consultant.profile.name,
        photo: (consultant.profile.photo ? consultant.profile.photo : null),
        price: consultant.profile.price,
        school: consultant.profile.school,
        major: consultant.profile.major,
        count: consultant.profile.count,
        labels: consultant.profile.labels,
        intro: consultant.profile.intro,
        star: (consultant.profile.star ? consultant.profile.star : null)
    };
    return studentListConsultant;
}


module.exports = 
{
    castToStudentListConsultant,
}