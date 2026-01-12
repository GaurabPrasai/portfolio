import ContactCard from "../common/ContactCard";

interface ContactPageProps {
  theme: {
    border: string;
    hover: string;
    accent: string;
  };
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function ContactPage({
  theme,
  onMouseEnter,
  onMouseLeave,
}: ContactPageProps) {
  const contactInfo = [
    {
      label: "Email",
      value: "gaurabprasaigp@gmail.com",
      url: "https://mail.google.com/mail/?view=cm&to=gaurabprasaigp@gmail.com",
    },
    {
      label: "Social",
      value: "@gaurabprasai",
      url: "https://www.linkedin.com/in/gaurab-prasai-6a771831a?",
    },
    {
      label: "Address",
      value: "Biratnagar, Nepal",
      url: "https://maps.app.goo.gl/VcWQJApXPXNwfnPJ7",
    },
  ];

  return (
    <main className="pt-24 md:pt-40 px-4 md:px-8 pb-12 md:pb-20">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          <div>
            <h2 className="text-3xl md:text-5xl mb-6 md:mb-8 tracking-tight">
              Let's talk
            </h2>
            <p className={`${theme.accent} text-base md:text-lg mb-6 md:mb-8`}>
              I'm always interested in hearing about new projects and
              opportunities.
            </p>
          </div>
          <div className="space-y-4 md:space-y-6">
            {contactInfo.map((info, index) => (
              <ContactCard
                key={index}
                label={info.label}
                value={info.value}
                url={info.url}
                theme={theme}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
