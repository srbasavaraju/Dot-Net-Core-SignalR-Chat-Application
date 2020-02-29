using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

namespace DotNetCoreSignalR.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string whomToSend, string message)
        {
            var userConnectionId = UserFactory.users.FirstOrDefault(user => user.Name.ToLower() == whomToSend.ToLower()).ConnectionId;
            if (userConnectionId != null)
            {
                await Clients.Client(userConnectionId).SendAsync("ReceiveMessage", user, message);
            }
        }

        public async Task SendGroupMessage(string user, string groupName, string message)
        {
            await Clients.Group("BBT").SendAsync("ReceiveGroupMessage", user, message);
        }

        public async Task JoinGroup(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);         
        }

        public override Task OnConnectedAsync()
        {
            string userName = Context.GetHttpContext().Request.Query["username"];
            if (userName != "null")
            {
                UserFactory.users.Add(new User()
                {
                    Name = userName.ToLower(),
                    ConnectionId = Context.ConnectionId
                });
            }
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(System.Exception exception)
        {
            List<User> users = UserFactory.users;
            if (users.Count > 0)
            {
                users.Remove(users.FirstOrDefault(user => user.ConnectionId == Context.ConnectionId));
            }
            return base.OnDisconnectedAsync(exception);
        }
    }
}
