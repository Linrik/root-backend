const mongoose = require("mongoose")

const langStatSchema = new mongoose.Schema({
    languague: String,
    news_route : String,
    events_route : String,
    about_us_route : String,
    profile : String,
    log_out : String,
    login: String,
    register : String,
    edit_news : String,
    register_user : String,
    dark_mode : String,
    logger : String,
    about : String,
    simple_root : String,
    simple_follow_us : String,
    simple_Test : String,
    simple_Event : String,
    simple_name : String,
    simple_username : String,
    simple_password : String,
    simple_forgot_password : String,
    simple_email : String,
    simple_repeat_password : String,
    root_student_association : String,
    simple_roles : String,
    role_administrator : String,
    role_editor : String,
    role_board_member : String,
    simple_title : String,
    simple_author: String,
    simple_upload: String,
    simple_send: String,
    article_title: String
})

module.exports = mongoose.model("Lang", langStatSchema, "langstatic");