import { Recipe } from "@jvrecipes/validation";
import { User } from "better-auth";

interface UserImageProps {
  user?: User | Recipe["user"];
}

const UserImage = ({ user }: UserImageProps) => {
  if (user?.image) {
    return (
      <img
        className="size-10 rounded-full border-2 border-foreground bg-accent object-cover"
        src={user.image}
        width={40}
        height={40}
        alt={
          user.name ? `${user.name} profile picture` : "Your profile picture"
        }
      />
    );
  }

  const initials =
    user?.name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "YR";
  return (
    <div className="bg-accent text-accent-foreground flex size-10 items-center justify-center rounded-full border-2 border-foreground">
      <span className="font-display text-sm leading-none">{initials}</span>
    </div>
  );
};

export default UserImage;
