from flask import Flask, request, render_template
import pyrebase

tutortree = Flask(__name__)
#firebase = pyrebase.initialize_app(STUB)

@tutortree.route("/sendReferralTo/<email>/<sender_name>/<sender_school>/<date_expires>")
def sendReferralTo(email,sender_name,sender_school, date_expires):

    #email_sender = 'testemail@hello.com'
    email_receiver = email

    msg = MIMEMultipart('alternative')
    msg['From'] = formataddr((str(Header('Tutortree', 'utf-8')), email_sender))
    msg['To'] = email_receiver
    msg['Subject']= sender_name + ' sent you $10 toward your first session!'
  
    text = "Someone sent you $10 for toward your first session!"
    html = render_template('referral_email.html', sender=sender_name, school=sender_school, expiry=date_expires)
    part1 = MIMEText(text, 'plain')
    part2 = MIMEText(html, 'html')
    msg.attach(part1)
    msg.attach(part2)
    #connection = smtplib.SMTP(STUB)
    connection.starttls()
    #connection.login(STUB)
    connection.sendmail(email_sender, email_receiver, msg.as_string() )
    connection.quit()
    return None
