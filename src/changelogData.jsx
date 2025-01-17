import ListName from "@components/listName";
import { watchedName, watchlistName } from "@/util";
import { Link } from "react-router-dom";

export const updates = [
  {
    date: "2024-08-26",
    changelog: (
      <ul>
        <li>
          Added handling of missing media. If Wookieepedia removes an item from the timeline, and
          you had it in a list, it will show up as "missing item" in that list's page. This most
          commonly happens, when an item is split into individual stories, like a TV show being
          replaced by its episodes.
        </li>
      </ul>
    ),
  },
  {
    title: "v0.5",
    date: "2024-08-19",
    changelog: (
      <ul>
        <li>Added this changelog page to keep track of the updates.</li>
        <li>
          User accounts. Create an account with email or google sign-in. Usernames are kinda useless
          now, but they might become useful later ;)
        </li>
        <li>
          Lists (requires an account):
          <ul>
            <li>
              You can add media to lists. Add/remove a single entry with the buttons that show up in
              an expanded entry in the timeline, or enable the "Selection" column to add/remove
              multiple entries to a list at once.
            </li>
            <li>
              There are two built-in lists: <ListName name={watchedName} /> and{" "}
              <ListName name={watchlistName} />
            </li>
            <li>You can create custom lists.</li>
            <li>In the timeline you can filter out a list, or show only its elements.</li>
            <li>
              You can view, rename and delete your lists from the <Link to="/lists">lists</Link>{" "}
              page.
            </li>
          </ul>
        </li>
        <li>Fixed date range filter breaking if "From" date was after "To" date.</li>
        <li>Added a "scroll to top" button in the bottom right in the timeline.</li>
        <li>Removed the "Writer" column to match the same removal in the Wookieepedia timeline.</li>
        <li>
          Replaced the randomly generated media card in the homepage with some useful (and some less
          useful) info (more to come).
        </li>
        <li>
          Did a lot of refactoring to improve the codebase, which will hopefully allow me to add new
          features faster.
        </li>
      </ul>
    ),
  },
  {
    title: "Prior updates",
    changelog: (
      <ul>
        <li>Fixed "Collapse adjacent episodes" sometimes breaking the website.</li>
        <li>
          Appearances!
          <ul>
            <li>
              Every media has a list of all its appearances. Click on a title in the timeline, then
              click "Show appearances"
            </li>
            <li>You can hide mentions, flashback, and hologram appearances.</li>
            <li>
              You can filter the timeline by appearances, use the icons underneath the filter input
              box.
            </li>
            <li>
              With multiple appearances filters, ANY match will result in showing the media. Check
              "Must include all" to require ALL your appearances filters to match in order to show
              the media.
            </li>
            <li>You can also exclude mentions, flashbacks, and holograms from the search.</li>
          </ul>
        </li>
        <li>State of filters is now remembered across sessions.</li>
        <li>You can now reset all filters with a single button.</li>
        <li>
          Multiple entries linking to a single article in wookieepedia timeline are now correctly
          displayed (like BF2 missions)
        </li>
        <li>
          Timeline range:
          <ul>
            <li>
              You can now select a range of years to display in the timeline. This accepts years
              like "5 BBY" or "5 ABY" ("-5" and "5" also work).
            </li>
            <li>You can also switch to a release date range, like "2005-05-19".</li>
            <li>
              In both cases you can put titles of media like "Star Wars: Episode III Revenge of the
              Sith". The title has to be exact. If the background of the input box turns blue, that
              means it's working.
            </li>
            <li>There's a couple of premade ranges availible.</li>
          </ul>
        </li>
        <li>Many wookieepedia script improvements.</li>
      </ul>
    ),
  },
];
