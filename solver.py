import json
import time
from selenium import webdriver
from selenium.webdriver.firefox.options import Options


def merge_data(current_data, new_data):
    for k, v in new_data.items():
        if isinstance(v, dict):
            if k not in current_data:
                current_data[k] = v
            else:
                merge_data(current_data[k], v)
        else:
            current_data[k] = v


def get_pairs(data):
    data_length = len(data)
    pair_tuples = []

    for i, j in enumerate(data):
        for k in range(i + 1, data_length):
            pair_tuples.append((j["text"], data[k]["text"]))

    return pair_tuples


def main():
    options = Options()
    options.headless = True
    driver = webdriver.Firefox(options=options)

    driver.get("https://neal.fun/infinite-craft")

    with open("data.json", "r") as file:
        current_data = json.load(file)["elements"]

    all_pairs = get_pairs(current_data)
    for i in range(len(all_pairs)):
        url = f"https://neal.fun/api/infinite-craft/pair?first={all_pairs[i][0]}&second={all_pairs[i][1]}"

        print(all_pairs[i])

        response_text = driver.execute_script(
            f"""
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "{url}", false);  // Synchronous request
            xhr.send();
            return xhr.responseText;
        """
        )

        print(response_text)

        time.sleep(0.3)

    driver.quit()


if __name__ == "__main__":
    main()
