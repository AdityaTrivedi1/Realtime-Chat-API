const User = require('../models/user')
const Group = require('../models/group')
const MemberOf = require('../models/member_of')
const {StatusCodes} = require('http-status-codes')
const jwt = require('jsonwebtoken')

const getUserAndGroups = async (req, res) => {
    const {user_id} = req.body

    let users = await User.find({}).select('user_id username -_id')
    
    let group_ids = await MemberOf.find({user_id}).select('group_id -_id')
    let groups = []

    for (elem in group_ids) {
        const {group_id} = group_ids[elem]
        let group = await Group.findOne({group_id}).select('group_id groupname description creation_date no_of_members -_id')

        let members = await MemberOf.find({group_id}).select('user_id -_id')

        members = members.map((member) => {
            return member.user_id
        })

        const newElement = {
            group_id: group.group_id,
            groupname: group.groupname,
            description: group.description,
            creation_date: group.creation_date,
            no_of_members: group.no_of_members,
            members
        }

        groups = [...groups, newElement]
    }

    res.status(StatusCodes.OK).json({users, groups})
}

module.exports = getUserAndGroups
