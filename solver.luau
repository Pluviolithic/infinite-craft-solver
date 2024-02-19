local fs = require("@lune/fs")
local net = require("@lune/net")
local task = require("@lune/task")

local function mergeData(currentData, newData)
	for k, v in pairs(newData) do
		if type(v) == "table" then
			if currentData[k] == nil then
				currentData[k] = v
			else
				mergeData(currentData[k], v)
			end
		else
			currentData[k] = v
		end
	end
end

local function getPairs(data)
	local dataLength = #data
	local pairTuples = {}

	for i, j in ipairs(data) do
		for k = i, dataLength do
			if i ~= j then
				table.insert(pairTuples, { j.text, data[k].text })
			end
		end
	end

	return pairTuples
end

local function main()
	local currentData = net.jsonDecode(fs.readFile("data.json")).elements
	--local newData = {}

	-- simply doesn't work

	local allPairs = getPairs(currentData)
	for i = 1, 100 do
		print(`https://neal.fun/api/infinite-craft/pair?first={allPairs[i][1]}&second={allPairs[i][2]}`)
		print(net.request({
			method = "GET",
			url = `https://neal.fun/api/infinite-craft/pair?first={allPairs[i][1]}&second={allPairs[i][2]}`,
			headers = {
				["User-Agent"] = "Mozilla/5.0 (X11; Linux x86_64; rv:122.0) Gecko/20100101 Firefox/122.0",
				["Accept-Language"] = "en-US,en;q=0.5",
				["Accept"] = "*/*",
				["Referrer"] = "https://neal.fun/infinite-craft/",
				["Referrer-Policy"] = "strict-origin-when-cross-origin",
				["Host"] = "neal.fun",
				["Accept-Encoding"] = "gzip, deflate, br",
				["Connection"] = "keep-alive",
				["Sec-Fetch-Dest"] = "empty",
				["Sec-Fetch-Mode"] = "cors",
				["Sec-Fetch-Site"] = "same-site",
				["TE"] = "trailers",
				["DNT"] = "1",
			},
		}))
		task.wait(1)
	end
end

main()
