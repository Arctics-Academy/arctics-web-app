const castToStudentListConsultant = function(consultant) {
    let studentListConsultant = {
        consultantId: consultant.id,
        photo: (consultant.profile.photo ? consultant.profile.photo : null),
        price: consultant.profile.price,
        school: consultant.profile.school,
        count: consultant.profile.count,
        labels: consultant.profile.labels,
        intro: consultant.profile.intro,
        star: (consultant.profile.star ? consultant.profile.star : null),
        major: consultant.profile.major
    };
    return studentListConsultant;
}


module.exports = 
{
    castToStudentListConsultant,
}