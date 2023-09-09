package rocks.zipcode.klasschat.service;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import rocks.zipcode.klasschat.domain.Workspace;
import rocks.zipcode.klasschat.repository.WorkspaceRepository;
import rocks.zipcode.klasschat.service.dto.WorkspaceDTO;
import rocks.zipcode.klasschat.service.mapper.WorkspaceMapper;

/**
 * Service Implementation for managing {@link Workspace}.
 */
@Service
@Transactional
public class WorkspaceService {

    private final Logger log = LoggerFactory.getLogger(WorkspaceService.class);

    private final WorkspaceRepository workspaceRepository;

    private final WorkspaceMapper workspaceMapper;

    public WorkspaceService(WorkspaceRepository workspaceRepository, WorkspaceMapper workspaceMapper) {
        this.workspaceRepository = workspaceRepository;
        this.workspaceMapper = workspaceMapper;
    }

    /**
     * Save a workspace.
     *
     * @param workspaceDTO the entity to save.
     * @return the persisted entity.
     */
    public WorkspaceDTO save(WorkspaceDTO workspaceDTO) {
        log.debug("Request to save Workspace : {}", workspaceDTO);
        Workspace workspace = workspaceMapper.toEntity(workspaceDTO);
        workspace = workspaceRepository.save(workspace);
        return workspaceMapper.toDto(workspace);
    }

    /**
     * Update a workspace.
     *
     * @param workspaceDTO the entity to save.
     * @return the persisted entity.
     */
    public WorkspaceDTO update(WorkspaceDTO workspaceDTO) {
        log.debug("Request to update Workspace : {}", workspaceDTO);
        Workspace workspace = workspaceMapper.toEntity(workspaceDTO);
        workspace = workspaceRepository.save(workspace);
        return workspaceMapper.toDto(workspace);
    }

    /**
     * Partially update a workspace.
     *
     * @param workspaceDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<WorkspaceDTO> partialUpdate(WorkspaceDTO workspaceDTO) {
        log.debug("Request to partially update Workspace : {}", workspaceDTO);

        return workspaceRepository
            .findById(workspaceDTO.getId())
            .map(existingWorkspace -> {
                workspaceMapper.partialUpdate(existingWorkspace, workspaceDTO);

                return existingWorkspace;
            })
            .map(workspaceRepository::save)
            .map(workspaceMapper::toDto);
    }

    /**
     * Get all the workspaces.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<WorkspaceDTO> findAll() {
        log.debug("Request to get all Workspaces");
        return workspaceRepository.findAll().stream().map(workspaceMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get all the workspaces with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<WorkspaceDTO> findAllWithEagerRelationships(Pageable pageable) {
        return workspaceRepository.findAllWithEagerRelationships(pageable).map(workspaceMapper::toDto);
    }

    /**
     * Get one workspace by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<WorkspaceDTO> findOne(Long id) {
        log.debug("Request to get Workspace : {}", id);
        return workspaceRepository.findOneWithEagerRelationships(id).map(workspaceMapper::toDto);
    }

    /**
     * Delete the workspace by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Workspace : {}", id);
        workspaceRepository.deleteById(id);
    }
}
