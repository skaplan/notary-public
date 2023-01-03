const disassociateDropboxAccountResolver = async (obj, args, { user }) => {
  const updatedUser = await user
    .$query()
    .update({
      status: null,
      dropboxId: null,
      token: null,
    })
    .returning('*')

  return updatedUser
}

module.exports = {
  Mutation: {
    disassociateDropboxAccount: disassociateDropboxAccountResolver,
  },
}
