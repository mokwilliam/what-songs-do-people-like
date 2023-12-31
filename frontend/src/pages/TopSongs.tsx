import "primeflex/primeflex.css";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { useEffect, useState } from "react";
import "../App.css";
import { TopBar } from "../components/TopBar";
import TopSongsGrid from "../components/TopSongsGrid";
import TopSongsList from "../components/TopSongsList";

function TopSongs() {
  type LayoutOption = 'list' | 'grid';
  const [topSongs, setTopSongs] = useState([]);
  const [layout, setLayout] = useState<LayoutOption>("list");

  useEffect(() => {
    const fetchTopSongs = async () => {
      try {
        // const response = await fetch("/api/songs"); doesn't work under Docker
        const response = await fetch("http://localhost:8000/songs"); // work with both
        const data = await response.json();
        setTopSongs(data);
      } catch (error) {
        console.error("Error fetching top songs:", error);
      }
    };

    fetchTopSongs();
  }, []);

  const itemTemplate = (song: any, layout: string) => {
    if (!song) {
      return;
    }

    if (layout === "list") return <TopSongsList song={song} />;
    else if (layout === "grid") return <TopSongsGrid song={song} />;
  };

  const header = () => {
    return (
      <div className="flex justify-content-end">
        <DataViewLayoutOptions
          layout={layout}
          onChange={(e) => setLayout(e.value as LayoutOption)}
        />
      </div>
    );
  };

  return (
    <>
      <TopBar />
      <div className="top-songs">
        <h1>Top 50 Songs</h1>
        <div className="card">
          <DataView
            value={topSongs}
            itemTemplate={itemTemplate}
            layout={layout}
            header={header()}
          />
        </div>
      </div>
    </>
  );
}

export default TopSongs;
