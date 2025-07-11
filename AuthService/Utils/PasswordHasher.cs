using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace AuthService.Utils
{
    public static class PasswordHasher
    {
        public static string Hash(string password)
        {
            // Generar salt
            byte[] salt = RandomNumberGenerator.GetBytes(128 / 8);

            // Derivar clave
            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 100000,
                numBytesRequested: 256 / 8));

            // Guardar salt + hash concatenado
            return $"{Convert.ToBase64String(salt)}.{hashed}";
        }

        public static bool Verify(string password, string storedHash)
        {
            var parts = storedHash.Split('.');
            if (parts.Length != 2) return false;

            byte[] salt = Convert.FromBase64String(parts[0]);
            string hashOfInput = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 100000,
                numBytesRequested: 256 / 8));

            return hashOfInput == parts[1];
        }
    }
}
