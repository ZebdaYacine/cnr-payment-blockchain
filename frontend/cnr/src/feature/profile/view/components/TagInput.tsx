import { useState, KeyboardEvent, ChangeEvent } from "react";
import { User } from "../../../../core/dtos/data";
import { BsXLg } from "react-icons/bs";

interface TagInputProps {
  userList: User[];
}

const TagInput: React.FC<TagInputProps> = ({ userList }) => {
  const [tags, setTags] = useState<User[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<User[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const addTag = (user: User) => {
    if (!tags.some((tag) => tag.id === user.id)) {
      setTags([...tags, user]);
    }
    setInputValue("");
    setShowSuggestions(false);
    setActiveIndex(-1);
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && filteredSuggestions[activeIndex]) {
        addTag(filteredSuggestions[activeIndex]);
      } else {
        const user = userList.find(
          (u) => u.username === inputValue.trim().slice(1)
        );
        if (user) addTag(user);
      }
    } else if (e.key === "Backspace" && inputValue === "@" && tags.length > 0) {
      removeTag(tags.length - 1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Ensure input is at least 1 character beyond "@"
    if (value.length > 1 && value.startsWith("@")) {
      const filtered = userList.filter((user) =>
        user.username.toLowerCase().includes(value.toLowerCase().slice(1))
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      setActiveIndex(-1);
    } else {
      setShowSuggestions(false);
      setFilteredSuggestions([]);
    }
  };

  const handleSuggestionClick = (user: User) => {
    addTag(user);
  };

  return (
    <div className="flex flex-col w-full max-w-lg">
      <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg bg-base-100 shadow-md">
        {tags.map((tag, index) => (
          <span
            key={tag.id}
            className="badge badge-primary gap-2 px-3 py-2 flex items-center"
          >
            {tag.username} - {tag.workAt} / {tag.wilaya}{" "}
            <BsXLg
              className="cursor-pointer ml-2 hover:text-red-500"
              onClick={() => removeTag(index)}
            />
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="@username"
          className="input input-bordered w-full focus:outline-none"
          onFocus={() => setShowSuggestions(filteredSuggestions.length > 0)}
        />
      </div>

      {showSuggestions && (
        <ul className="menu bg-base-100 w-full border border-gray-200 rounded-md mt-2 shadow-lg transition-all duration-200">
          {filteredSuggestions.map((user, index) => (
            <li
              key={user.id}
              className={`p-2 cursor-pointer transition-all duration-150 ${
                index === activeIndex
                  ? "bg-primary text-white"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleSuggestionClick(user)}
            >
              <span className="font-semibold text-blue-600">
                {user.username} - {user.workAt} / {user.wilaya}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TagInput;
