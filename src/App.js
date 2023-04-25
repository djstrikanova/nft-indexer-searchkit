import {
  DateRangeFacet,
  MultiMatchQuery,
  RangeFacet,
  RefinementSelectFacet,
} from "@searchkit/sdk";
import {
  FacetsList,
  SearchBar,
  ResetSearchButton,
  SelectedFilters,
  Pagination,
} from "@searchkit/elastic-ui";
import { useSearchkitVariables } from "@searchkit/client";
import { useSearchkitSDK } from "@searchkit/sdk/lib/esm/react-hooks";
import {
  EuiPage,
  EuiFlexGrid,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiPageContentHeaderSection,
  EuiPageHeader,
  EuiPageHeaderSection,
  EuiPageSideBar,
  EuiTitle,
  EuiHorizontalRule,
  EuiText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiCard,
  EuiImage,
  EuiPanel,
  EuiButton
} from "@elastic/eui";

import "@elastic/eui/dist/eui_theme_light.css";
import "./App.css";

const config = {
  host: "https://nft-indexer-router.effectdao.tools",
  connectionOptions: {

  },

  index: "nfts",
  hits: {
    fields: ["caption_model_vit_l_14_openai","id","ipfs_hash"],
    size: 25
  },
  query: new MultiMatchQuery({
    fields: ["caption_model_vit_l_14_openai"],
  }),
  facets: [
    new RefinementSelectFacet({
      field: "associated_collections.keyword",
      identifier: "associated_collections",
      label: "Collection",
      multipleSelect: true,
      size: 20,
      searchable: true
    })

    ]
};

const HitsList = ({ data }) => (
  <EuiFlexGrid columns={3} gutterSize="xl">
    {data?.hits.items.map((hit) => (

      <EuiFlexItem key={hit.id}>
        <EuiFlexGroup gutterSize="xl">
          <EuiFlexItem grow={true} wrapText
                       style={{ maxWidth: "300px" }}>
                <EuiImage
                    caption={
                      hit.highlight && hit.highlight.caption_model_vit_l_14_openai
                          ? <span dangerouslySetInnerHTML={{ __html: hit.highlight.caption_model_vit_l_14_openai }} />
                          : hit.fields.caption_model_vit_l_14_openai || "No field found"
                    }
                    src={"https://atomichub-ipfs.com/ipfs/" + hit.fields.ipfs_hash}
                    style={{ maxWidth: "300px" }}
                    size="l"
                    allowFullScreen
                    fullScreenIconColor="dark"
                />
              </EuiFlexItem>
          {/*<EuiFlexItem>*/}
          {/*  <a href={"https://atomichub-ipfs.com/ipfs/"+hit.id} target="_blank" rel="noreferrer noopener">*/}
          {/*    View Image*/}
          {/*  </a>*/}
          {/*  <p>{hit.id}</p>*/}
          {/*</EuiFlexItem>*/}
          <EuiFlexItem>

          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlexItem>

    ))}
  </EuiFlexGrid>
);

function App() {
  const Facets = FacetsList(config.facets);
  const variables = useSearchkitVariables();
  const { results, loading } = useSearchkitSDK(config, variables);


  return (
    <EuiPage>
      <EuiPageSideBar>
        <SearchBar loading={loading} />
        <EuiHorizontalRule margin="m" />
        <Facets data={results} loading={loading} />

      </EuiPageSideBar>
      <EuiPageBody component="div">
        <EuiPageHeader>
          <EuiPageHeaderSection>
            <EuiTitle size="l">
              <SelectedFilters data={results} loading={loading} />
            </EuiTitle>
          </EuiPageHeaderSection>
          <EuiPageHeaderSection>
            <ResetSearchButton loading={loading} />
          </EuiPageHeaderSection>
        </EuiPageHeader>
        <EuiPageContent>
          <EuiPageContentHeader>
            <EuiPageContentHeaderSection>
              <EuiTitle size="s">
                <h2>{results?.summary.total} Results</h2>
              </EuiTitle>
            </EuiPageContentHeaderSection>
          </EuiPageContentHeader>
          <EuiPageContentBody>
            <HitsList data={results} />
            <EuiFlexGroup justifyContent="spaceAround">
              <Pagination data={results} />
            </EuiFlexGroup>
          </EuiPageContentBody>
        </EuiPageContent>
      </EuiPageBody>
    </EuiPage>
  );
}

export default App;
