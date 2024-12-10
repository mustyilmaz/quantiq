using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace quantiq.Server.Dtos
{
    public class UserLoginDto
    {
        public string EmailOrPhone {get; set;}
        public string Password {get; set;}
    }
}