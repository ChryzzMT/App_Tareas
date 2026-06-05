using MailKit.Net.Smtp;
using MimeKit;

namespace tiendaweb_backend.Servicios;

public class EmailService
{
    private readonly string _email = "juanvirgilioes@gmail.com";
    private readonly string _password = "owjg iasg eirt jcvl";

    public async Task EnviarEmail(string destinatario, string tituloTarea, DateTime fechaEntrega)
    {
        var mensaje = new MimeMessage();
        mensaje.From.Add(MailboxAddress.Parse(_email));
        mensaje.To.Add(MailboxAddress.Parse(destinatario));
        mensaje.Subject = "⚠️ Tu tarea vence en 24 horas";

        mensaje.Body = new TextPart("plain")
        {
            Text = $"Hola!\n\nTienes 1 día para acabar la tarea: {tituloTarea}\n" +
                   $"Fecha de entrega: {fechaEntrega:dd/MM/yyyy HH:mm}\n\n" +
                   $"No te olvides de entregarla a tiempo!"
        };

        using var smtp = new SmtpClient();
        await smtp.ConnectAsync("smtp.gmail.com", 587, MailKit.Security.SecureSocketOptions.StartTls);
        await smtp.AuthenticateAsync(_email, _password);
        await smtp.SendAsync(mensaje);
        await smtp.DisconnectAsync(true);
    }
}