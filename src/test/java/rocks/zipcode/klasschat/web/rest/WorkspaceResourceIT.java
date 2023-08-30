package rocks.zipcode.klasschat.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import rocks.zipcode.klasschat.IntegrationTest;
import rocks.zipcode.klasschat.domain.Workspace;
import rocks.zipcode.klasschat.repository.WorkspaceRepository;
import rocks.zipcode.klasschat.service.WorkspaceService;
import rocks.zipcode.klasschat.service.dto.WorkspaceDTO;
import rocks.zipcode.klasschat.service.mapper.WorkspaceMapper;

/**
 * Integration tests for the {@link WorkspaceResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class WorkspaceResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/workspaces";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private WorkspaceRepository workspaceRepository;

    @Mock
    private WorkspaceRepository workspaceRepositoryMock;

    @Autowired
    private WorkspaceMapper workspaceMapper;

    @Mock
    private WorkspaceService workspaceServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restWorkspaceMockMvc;

    private Workspace workspace;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Workspace createEntity(EntityManager em) {
        Workspace workspace = new Workspace().name(DEFAULT_NAME).description(DEFAULT_DESCRIPTION);
        return workspace;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Workspace createUpdatedEntity(EntityManager em) {
        Workspace workspace = new Workspace().name(UPDATED_NAME).description(UPDATED_DESCRIPTION);
        return workspace;
    }

    @BeforeEach
    public void initTest() {
        workspace = createEntity(em);
    }

    @Test
    @Transactional
    void createWorkspace() throws Exception {
        int databaseSizeBeforeCreate = workspaceRepository.findAll().size();
        // Create the Workspace
        WorkspaceDTO workspaceDTO = workspaceMapper.toDto(workspace);
        restWorkspaceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(workspaceDTO)))
            .andExpect(status().isCreated());

        // Validate the Workspace in the database
        List<Workspace> workspaceList = workspaceRepository.findAll();
        assertThat(workspaceList).hasSize(databaseSizeBeforeCreate + 1);
        Workspace testWorkspace = workspaceList.get(workspaceList.size() - 1);
        assertThat(testWorkspace.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testWorkspace.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createWorkspaceWithExistingId() throws Exception {
        // Create the Workspace with an existing ID
        workspace.setId(1L);
        WorkspaceDTO workspaceDTO = workspaceMapper.toDto(workspace);

        int databaseSizeBeforeCreate = workspaceRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restWorkspaceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(workspaceDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Workspace in the database
        List<Workspace> workspaceList = workspaceRepository.findAll();
        assertThat(workspaceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = workspaceRepository.findAll().size();
        // set the field null
        workspace.setName(null);

        // Create the Workspace, which fails.
        WorkspaceDTO workspaceDTO = workspaceMapper.toDto(workspace);

        restWorkspaceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(workspaceDTO)))
            .andExpect(status().isBadRequest());

        List<Workspace> workspaceList = workspaceRepository.findAll();
        assertThat(workspaceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllWorkspaces() throws Exception {
        // Initialize the database
        workspaceRepository.saveAndFlush(workspace);

        // Get all the workspaceList
        restWorkspaceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(workspace.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllWorkspacesWithEagerRelationshipsIsEnabled() throws Exception {
        when(workspaceServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restWorkspaceMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(workspaceServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllWorkspacesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(workspaceServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restWorkspaceMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(workspaceRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getWorkspace() throws Exception {
        // Initialize the database
        workspaceRepository.saveAndFlush(workspace);

        // Get the workspace
        restWorkspaceMockMvc
            .perform(get(ENTITY_API_URL_ID, workspace.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(workspace.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingWorkspace() throws Exception {
        // Get the workspace
        restWorkspaceMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingWorkspace() throws Exception {
        // Initialize the database
        workspaceRepository.saveAndFlush(workspace);

        int databaseSizeBeforeUpdate = workspaceRepository.findAll().size();

        // Update the workspace
        Workspace updatedWorkspace = workspaceRepository.findById(workspace.getId()).get();
        // Disconnect from session so that the updates on updatedWorkspace are not directly saved in db
        em.detach(updatedWorkspace);
        updatedWorkspace.name(UPDATED_NAME).description(UPDATED_DESCRIPTION);
        WorkspaceDTO workspaceDTO = workspaceMapper.toDto(updatedWorkspace);

        restWorkspaceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, workspaceDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(workspaceDTO))
            )
            .andExpect(status().isOk());

        // Validate the Workspace in the database
        List<Workspace> workspaceList = workspaceRepository.findAll();
        assertThat(workspaceList).hasSize(databaseSizeBeforeUpdate);
        Workspace testWorkspace = workspaceList.get(workspaceList.size() - 1);
        assertThat(testWorkspace.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testWorkspace.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingWorkspace() throws Exception {
        int databaseSizeBeforeUpdate = workspaceRepository.findAll().size();
        workspace.setId(count.incrementAndGet());

        // Create the Workspace
        WorkspaceDTO workspaceDTO = workspaceMapper.toDto(workspace);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restWorkspaceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, workspaceDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(workspaceDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Workspace in the database
        List<Workspace> workspaceList = workspaceRepository.findAll();
        assertThat(workspaceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchWorkspace() throws Exception {
        int databaseSizeBeforeUpdate = workspaceRepository.findAll().size();
        workspace.setId(count.incrementAndGet());

        // Create the Workspace
        WorkspaceDTO workspaceDTO = workspaceMapper.toDto(workspace);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWorkspaceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(workspaceDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Workspace in the database
        List<Workspace> workspaceList = workspaceRepository.findAll();
        assertThat(workspaceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamWorkspace() throws Exception {
        int databaseSizeBeforeUpdate = workspaceRepository.findAll().size();
        workspace.setId(count.incrementAndGet());

        // Create the Workspace
        WorkspaceDTO workspaceDTO = workspaceMapper.toDto(workspace);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWorkspaceMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(workspaceDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Workspace in the database
        List<Workspace> workspaceList = workspaceRepository.findAll();
        assertThat(workspaceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateWorkspaceWithPatch() throws Exception {
        // Initialize the database
        workspaceRepository.saveAndFlush(workspace);

        int databaseSizeBeforeUpdate = workspaceRepository.findAll().size();

        // Update the workspace using partial update
        Workspace partialUpdatedWorkspace = new Workspace();
        partialUpdatedWorkspace.setId(workspace.getId());

        restWorkspaceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedWorkspace.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedWorkspace))
            )
            .andExpect(status().isOk());

        // Validate the Workspace in the database
        List<Workspace> workspaceList = workspaceRepository.findAll();
        assertThat(workspaceList).hasSize(databaseSizeBeforeUpdate);
        Workspace testWorkspace = workspaceList.get(workspaceList.size() - 1);
        assertThat(testWorkspace.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testWorkspace.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateWorkspaceWithPatch() throws Exception {
        // Initialize the database
        workspaceRepository.saveAndFlush(workspace);

        int databaseSizeBeforeUpdate = workspaceRepository.findAll().size();

        // Update the workspace using partial update
        Workspace partialUpdatedWorkspace = new Workspace();
        partialUpdatedWorkspace.setId(workspace.getId());

        partialUpdatedWorkspace.name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restWorkspaceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedWorkspace.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedWorkspace))
            )
            .andExpect(status().isOk());

        // Validate the Workspace in the database
        List<Workspace> workspaceList = workspaceRepository.findAll();
        assertThat(workspaceList).hasSize(databaseSizeBeforeUpdate);
        Workspace testWorkspace = workspaceList.get(workspaceList.size() - 1);
        assertThat(testWorkspace.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testWorkspace.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingWorkspace() throws Exception {
        int databaseSizeBeforeUpdate = workspaceRepository.findAll().size();
        workspace.setId(count.incrementAndGet());

        // Create the Workspace
        WorkspaceDTO workspaceDTO = workspaceMapper.toDto(workspace);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restWorkspaceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, workspaceDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(workspaceDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Workspace in the database
        List<Workspace> workspaceList = workspaceRepository.findAll();
        assertThat(workspaceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchWorkspace() throws Exception {
        int databaseSizeBeforeUpdate = workspaceRepository.findAll().size();
        workspace.setId(count.incrementAndGet());

        // Create the Workspace
        WorkspaceDTO workspaceDTO = workspaceMapper.toDto(workspace);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWorkspaceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(workspaceDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Workspace in the database
        List<Workspace> workspaceList = workspaceRepository.findAll();
        assertThat(workspaceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamWorkspace() throws Exception {
        int databaseSizeBeforeUpdate = workspaceRepository.findAll().size();
        workspace.setId(count.incrementAndGet());

        // Create the Workspace
        WorkspaceDTO workspaceDTO = workspaceMapper.toDto(workspace);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWorkspaceMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(workspaceDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Workspace in the database
        List<Workspace> workspaceList = workspaceRepository.findAll();
        assertThat(workspaceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteWorkspace() throws Exception {
        // Initialize the database
        workspaceRepository.saveAndFlush(workspace);

        int databaseSizeBeforeDelete = workspaceRepository.findAll().size();

        // Delete the workspace
        restWorkspaceMockMvc
            .perform(delete(ENTITY_API_URL_ID, workspace.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Workspace> workspaceList = workspaceRepository.findAll();
        assertThat(workspaceList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
