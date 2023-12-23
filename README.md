# UEC学内マップ(試験公開)
電気通信大学の学内マップデータならびに関連施設の座標データを提供しています。

大学公式サイト、学内配置図(電通大施設課サイト)、地理院地図のデータをもとに人力で作成しています。

> [!WARNING]
> 試験公開中のためデータ形式やURLが変更される場合があります

# 表示例
https://e-chan1007.github.io/uec-map/

- React(Next.js), `react-map-gl`/`maplibre-gl`を利用
- 地理院地図Vector（仮称）のデータに重ねて描画([スタイルファイル](https://github.com/gsi-cyberjapan/gsimaps-vector-stylesamples?tab=readme-ov-file#%E8%BB%BD%E3%81%84%E6%A8%99%E6%BA%96%E5%9C%B0%E5%9B%B3))
- 建物のクリック時に地物データを表示
- 階数データをもとにした疑似3D表示

# 提供しているデータ
| 種類 | GeoJSON(`.json`) | GeoJSON(`.geojson`) | FlatGeobuf(`.fgb`) |
| :-- | :-: | :-: | :-: |
| 全データ | [`all.json`](https://e-chan1007.github.io/uec-map/map/all.json) | [`all.geojson`](https://e-chan1007.github.io/uec-map/map/all.geojson)| [`all.fgb`](https://e-chan1007.github.io/uec-map/map/all.fgb) |
| 東地区 | [`east.json`](https://e-chan1007.github.io/uec-map/map/east.json) | [`east.geojson`](https://e-chan1007.github.io/uec-map/map/east.geojson)| [`east.fgb`](https://e-chan1007.github.io/uec-map/map/east.fgb) |
| 西地区 | [`west.json`](https://e-chan1007.github.io/uec-map/map/west.json) | [`west.geojson`](https://e-chan1007.github.io/uec-map/map/west.geojson)| [`west.fgb`](https://e-chan1007.github.io/uec-map/map/west.fgb) |
| 100周年記念キャンパス | [`100th.json`](https://e-chan1007.github.io/uec-map/map/100th.json) | [`100th.geojson`](https://e-chan1007.github.io/uec-map/map/100th.geojson)| [`100th.fgb`](https://e-chan1007.github.io/uec-map/map/100th.fgb) |
| キャンパス外施設 | [`external.json`](https://e-chan1007.github.io/uec-map/map/external.json) | [`external.geojson`](https://e-chan1007.github.io/uec-map/map/external.geojson)| [`external.fgb`](https://e-chan1007.github.io/uec-map/map/external.fgb) |

## 形式
- GeoJSON形式(拡張子`.geojson`, `.json`)
  どちらの拡張子でも同一のファイル内容です。
- FlatGeobuf形式(拡張子`.fgb`)
  バイナリ化・圧縮されたGeoJSON形式です。

## URL
`https://e-chan1007.github.io/uec-map/map/<all/east/west/100th/external>.<geojson/json/fgb>` \
地区別・形式別にファイルが用意されています。

## 地区ID
- `east`: 東地区
- `west`: 西地区
- `100th`: 100周年記念キャンパス
- `external`: キャンパス外の施設

## 地物タイプ
- `area`
  地区の外周にあたるポリゴンデータです。
- `building`
  大学キャンパス内の施設のポリゴンデータです。
- `building_sub`
  大学キャンパス内の施設のうち、優先度や利用頻度が低い施設のポリゴンデータです。
- `external`
  キャンパス外の施設(多摩川グラウンド・浜海寮・菅平セミナーハウス)の座標データです。
- `gate`
  キャンパス内の門の座標データです。
- `path`
  キャンパス内の通路のポリゴンデータです。
- `road`
  キャンパスの外周を通る道路のポリゴンデータです。
- `symbol`
  その他のポリゴンデータです。現在は正門前の噴水が登録されています。

## 属性一覧(GeoJSON内`properties`)
```ts
/**
 * 地区ID(前述)
 */
type Area = "east" | "west" | "100th" | "external";

/**
 * 地物タイプ(前述)
 */
type FeatureType = "area" | "building" | "building_sub" | "external" | "gate" | "path" | "road" | "symbol";

/**
 * [経度, 緯度]形式の配列
 */
type LngLat = [number, number];

interface Properties {
  type: FeatureType;
  area: Area;
  /**
   * 施設名称
   */
  name?: string;
  /**
   * 施設名称(英語表記)
   */
  name_en?: string;
  /**
   * 階層数(地上)
   */
  floors?: number;
  /**
   * おおよそ建物ポリゴンの中心にあたる座標
   * ポリゴンデータを含まない座標データの場合はその座標と同一
   */
  center?: LngLat;
}
```
- `name`, `name_en`, `floors`は建物データ以外には含まれません。
- `center`は建物データ・外周データ・座標データ以外には含まれません。
- 階数`floors`は同じ建物内で階数が異なる部分があっても最も高い階数を示します。


# `npm`パッケージ `@e-chan1007/uec-map`
後日公開予定

# 注意事項
本プロジェクトで提供される情報は電気通信大学・国土地理院とは無関係であり、データの正確性・完全性・有用性について保証をするものではありません。

また、本プロジェクトの内容は予告なく変更・削除する場合があります。

本プロジェクトの利用により生じた損失および損害等について、制作者は一切の責任も負わないものとします。
